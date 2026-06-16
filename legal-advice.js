// api/legal-advice.js
//
// Serverless proxy for the Anthropic API.
// Keeps the API key on the server — never exposed to the browser.
//
// Deploy this on Vercel:
// 1. Push this whole project (including the /api folder) to GitHub.
// 2. Import the repo on vercel.com.
// 3. In Vercel project settings -> Environment Variables, add:
//      ANTHROPIC_API_KEY = sk-ant-xxxxxxxx...
// 4. Deploy. Vercel automatically turns this file into:
//      https://your-project.vercel.app/api/legal-advice

export default async function handler(req, res) {
  // Allow requests from any origin (adjust if you want to restrict later)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, system } = req.body || {};

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing "query" in request body' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY configuration' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: system || '',
        messages: [{ role: 'user', content: query }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Anthropic API', details: String(err) });
  }
}
