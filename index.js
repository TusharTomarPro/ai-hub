import { useState } from 'react';

export default function Home() {
  const [provider, setProvider] = useState('huggingface');
  const [model, setModel] = useState('gpt2');
  const [prompt, setPrompt] = useState('Write a short intro about yourself.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setOutput('');
    try {
      if (provider === 'huggingface') {
        const r = await fetch('/api/hf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, inputs: prompt })
        });
        const data = await r.json();
        setOutput(JSON.stringify(data, null, 2));
      } else {
        const endpoint = 'https://api.openrouter.ai/v1/chat/completions';
        const payload = { model, messages: [{ role: 'user', content: prompt }] };

        const r = await fetch('/api/openrouter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint, payload })
        });

        const data = await r.json();
        setOutput(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setOutput('Error: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>AI Hub — one stop for many free AIs</h1>

      <label style={{ display: 'block', marginTop: 12 }}>
        Provider:
        <select value={provider} onChange={(e) => setProvider(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="huggingface">Hugging Face (Inference API)</option>
          <option value="openrouter">OpenRouter / Aggregators</option>
        </select>
      </label>

      <div style={{ marginTop: 12 }}>
        <label>Model:</label>
        <input value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%', marginTop: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Prompt</label>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} style={{ width: '100%', marginTop: 6 }} />
      </div>

      <button onClick={run} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? 'Running…' : 'Run'}
      </button>

      <h3>Output</h3>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f6f6', padding: 12 }}>{output}</pre>
    </main>
  );
}
