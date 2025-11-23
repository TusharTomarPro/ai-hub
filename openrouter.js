export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { endpoint, payload } = req.body;
  if (!endpoint || !payload) {
    return res.status(400).json({ error: 'endpoint and payload required' });
  }

  const KEY = process.env.OPENROUTER_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });

  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const contentType = r.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await r.json();
      return res.status(r.status).json(data);
    } else {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
  } catch (err) {
    res.status(500).json({
      error: 'proxy failed',
      details: String(err)
    });
  }
}
