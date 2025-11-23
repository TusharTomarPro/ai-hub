import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { model, inputs, parameters } = req.body;
  if (!model || inputs === undefined) return res.status(400).json({ error: 'model and inputs required' });

  const HF_KEY = process.env.HF_API_KEY;
  if (!HF_KEY) return res.status(500).json({ error: 'HF_API_KEY not configured' });

  try {
    const endpoint = `https://api-inference.huggingface.co/models/${model}`;
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs, parameters: parameters || {} })
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
    res.status(500).json({ error: 'HF proxy failed', details: String(err) });
  }
}
