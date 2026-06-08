const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const BASE = `${process.env.SUPABASE_URL}/rest/v1`;
const HDR = {
  'apikey': process.env.SUPABASE_KEY,
  'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

async function sb(method, path, body) {
  const extra = (method === 'POST' || method === 'PATCH') ? { 'Prefer': 'return=representation' } : {};
  const r = await fetch(`${BASE}${path}`, {
    method, headers: { ...HDR, ...extra },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 204 || r.status === 200 && r.headers.get('content-length') === '0') return null;
  const text = await r.text();
  return text ? JSON.parse(text) : null;
}

function roomId() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const params = req.method === 'GET' ? req.query : req.body;
  const { action } = params;

  try {
    // ── SEARCH: join matchmaking queue ──────────────────────────────────
    if (action === 'search') {
      const { player_id, player_name } = params;
      const isSpeed = player_id.startsWith('sp-');

      // Clean stale entries older than 90s
      await sb('DELETE', `/online_queue?created_at=lt.${new Date(Date.now() - 90000).toISOString()}`);

      // Remove any existing entry for this player
      await sb('DELETE', `/online_queue?player_id=eq.${player_id}`);

      // Look for someone else searching — speed players only match with speed players
      const modeFilter = isSpeed
        ? `player_id=like.sp-*&player_id=neq.${encodeURIComponent(player_id)}`
        : `player_id=not.like.sp-*&player_id=neq.${encodeURIComponent(player_id)}`;
      const queue = await sb('GET', `/online_queue?room_id=is.null&${modeFilter}&limit=1`);

      if (queue && queue.length > 0) {
        const opponent = queue[0];
        const rid = roomId();

        // Create the room
        await sb('POST', '/online_rooms', {
          room_id: rid,
          p1_id: opponent.player_id, p1_name: opponent.player_name,
          p2_id: player_id, p2_name: player_name,
        });

        // Tag opponent's queue entry with the room
        await sb('PATCH', `/online_queue?player_id=eq.${opponent.player_id}`, { room_id: rid, slot: 1 });

        // Add self to queue (tagged already)
        await sb('POST', '/online_queue', { player_id, player_name, room_id: rid, slot: 2 });

        res.status(200).json({ status: 'matched', room_id: rid, slot: 2, p1_name: opponent.player_name, p2_name: player_name });
      } else {
        // Join queue and wait
        await sb('POST', '/online_queue', { player_id, player_name });
        res.status(200).json({ status: 'searching' });
      }
    }

    // ── POLL_MATCH: check if matched while in queue ──────────────────────
    else if (action === 'poll_match') {
      const { player_id } = params;
      const entries = await sb('GET', `/online_queue?player_id=eq.${encodeURIComponent(player_id)}&limit=1`);
      const e = entries?.[0];
      if (!e) { res.status(200).json({ status: 'not_found' }); return; }
      if (!e.room_id) { res.status(200).json({ status: 'searching' }); return; }

      const rooms = await sb('GET', `/online_rooms?room_id=eq.${e.room_id}&limit=1`);
      const room = rooms?.[0];
      if (!room) { res.status(200).json({ status: 'searching' }); return; }

      res.status(200).json({ status: 'matched', room_id: e.room_id, slot: e.slot, p1_name: room.p1_name, p2_name: room.p2_name });
    }

    // ── READY: player taps Ready button ─────────────────────────────────
    else if (action === 'ready') {
      const { room_id, player_id, slot } = params;
      const field = slot == 1 ? 'p1_ready' : 'p2_ready';
      await sb('PATCH', `/online_rooms?room_id=eq.${room_id}`, { [field]: true });

      // Remove from queue
      await sb('DELETE', `/online_queue?player_id=eq.${player_id}`);

      const rooms = await sb('GET', `/online_rooms?room_id=eq.${room_id}&limit=1`);
      const room = rooms?.[0];
      const bothReady = room?.p1_ready && room?.p2_ready;
      if (bothReady) await sb('PATCH', `/online_rooms?room_id=eq.${room_id}`, { status: 'playing' });

      res.status(200).json({ both_ready: bothReady });
    }

    // ── POLL_READY: check if both players are ready ──────────────────────
    else if (action === 'poll_ready') {
      const { room_id } = params;
      const rooms = await sb('GET', `/online_rooms?room_id=eq.${room_id}&limit=1`);
      const room = rooms?.[0];
      if (!room) { res.status(404).json({ error: 'not found' }); return; }
      res.status(200).json({ both_ready: room.p1_ready && room.p2_ready, status: room.status });
    }

    // ── POLL_GAME: get full room state ───────────────────────────────────
    else if (action === 'poll_game') {
      const { room_id } = params;
      const rooms = await sb('GET', `/online_rooms?room_id=eq.${room_id}&limit=1`);
      const room = rooms?.[0];
      if (!room) { res.status(404).json({ error: 'not found' }); return; }
      res.status(200).json(room);
    }

    // ── EVENT: player posts an action result ─────────────────────────────
    else if (action === 'event') {
      const { room_id, slot, event_type, data, my_state } = params;
      const prefix = slot == 1 ? 'p1' : 'p2';
      const updates = {
        pending_event: { actor_slot: slot, event_type, data, ts: Date.now() },
        [`${prefix}_castle`]: my_state.castle,
        [`${prefix}_gold`]: my_state.gold,
        [`${prefix}_army`]: my_state.army,
        [`${prefix}_shields`]: my_state.shields,
        updated_at: new Date().toISOString(),
      };
      if (event_type === 'forfeit') {
        const rooms = await sb('GET', `/online_rooms?room_id=eq.${room_id}&limit=1`);
        const room = rooms?.[0];
        updates.status = 'finished';
        updates.winner_name = slot == 1 ? room?.p2_name : room?.p1_name;
      }
      await sb('PATCH', `/online_rooms?room_id=eq.${room_id}`, updates);
      res.status(200).json({ ok: true });
    }

    // ── FINISH: castle reached 0 ─────────────────────────────────────────
    else if (action === 'finish') {
      const { room_id, winner_name } = params;
      await sb('PATCH', `/online_rooms?room_id=eq.${room_id}`, {
        status: 'finished', winner_name, updated_at: new Date().toISOString(),
      });
      res.status(200).json({ ok: true });
    }

    else if (action === 'cancel') {
      const { player_id } = params;
      await sb('DELETE', `/online_queue?player_id=eq.${encodeURIComponent(player_id)}`);
      res.status(200).json({ ok: true });
    }

    else {
      res.status(400).json({ error: 'unknown action' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
