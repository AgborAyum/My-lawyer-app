// api/legal-advice.js
// Serverless proxy for OpenRouter API
// Supports 100+ AI models via a single endpoint
//
// Setup on Vercel:
// Settings -> Environment Variables -> Add:
//   OPENROUTER_API_KEY = sk-or-xxxxxxxx...
// Get your key at: openrouter.ai/keys

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, system } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing OPENROUTER_API_KEY' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://mylawyer.vercel.app',
        'X-Title': 'MyLawyer Cameroon',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',   // change this to any model on openrouter.ai/models
        max_tokens: 1000,
        messages: [
          { role: 'system', content: system || '' },
          { role: 'user',   content: query },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });

    // Normalize response to Anthropic format (what app.js expects)
    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach OpenRouter', details: String(err) });
  }
}
