const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const base = `${process.env.SUPABASE_URL}/rest/v1/leaderboard`;
  const headers = {
    'apikey': process.env.SUPABASE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    const diff = req.query.difficulty || 'medium';
    const r = await fetch(
      `${base}?difficulty=eq.${diff}&order=time_secs.asc&limit=10&select=name,time_secs,score`,
      { headers }
    );
    const data = await r.json();
    res.status(200).json(data);
    return;
  }

  if (req.method === 'POST') {
    const { name, time_secs, score, difficulty } = req.body;

    await fetch(base, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, time_secs, score, difficulty }),
    });

    // Fetch updated top 10 to find rank
    const r = await fetch(
      `${base}?difficulty=eq.${difficulty}&order=time_secs.asc&limit=10&select=name,time_secs,score`,
      { headers }
    );
    const board = await r.json();
    const rank = Array.isArray(board)
      ? board.findIndex(e => e.name === name && e.time_secs === time_secs)
      : -1;

    res.status(200).json({ rank });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
