const express = require('express');
const app = express();

// ── CORS — accetta chiamate da Cloudflare Pages e localhost ─
app.use((req, res, next) => {
  const allowed = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];
  const origin = req.headers.origin || '';
  // Accetta localhost + qualsiasi dominio .pages.dev (Cloudflare) + dominio custom
  if (!origin || allowed.includes(origin) || origin.endsWith('.pages.dev') || origin.endsWith('.cloudflare.com')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Per sicurezza accetta comunque (puoi restringere con il tuo dominio)
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.static(__dirname));

// ── PROXY ANTHROPIC ────────────────────────────────────────
app.post('/api/claude', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(400).json({ error: 'API key mancante.' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PREZZI YAHOO FINANCE ───────────────────────────────────
app.get('/api/prices', async (req, res) => {
  const tickers = (req.query.tickers || '').split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
  if (!tickers.length) return res.status(400).json({ error: 'Nessun ticker' });

  const results = {};
  await Promise.all(tickers.map(async (ticker) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
      });
      const data = await resp.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta) {
        const price = meta.regularMarketPrice ?? meta.previousClose ?? null;
        const prev  = meta.previousClose ?? null;
        const chg   = (price && prev) ? ((price - prev) / prev * 100) : null;
        results[ticker] = {
          price:    price ? parseFloat(price.toFixed(4)) : null,
          prev:     prev  ? parseFloat(prev.toFixed(4))  : null,
          change:   chg   ? parseFloat(chg.toFixed(2))   : null,
          currency: meta.currency || '?',
          name:     meta.shortName || ticker,
          market:   meta.exchangeName || '',
          timestamp: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null
        };
      } else {
        results[ticker] = { price: null, error: 'Non trovato' };
      }
    } catch (e) {
      results[ticker] = { price: null, error: e.message };
    }
  }));

  res.json(results);
});

// ── HEALTH CHECK ───────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ APEX TRADER API in ascolto sulla porta ${PORT}`);
});

// ── STORICO 1 ANNO ─────────────────────────────────────────
app.get('/api/history', async (req, res) => {
  const ticker = (req.query.ticker || '').trim().toUpperCase();
  if (!ticker) return res.status(400).json({ error: 'Ticker mancante' });
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1y`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    const data = await resp.json();
    const result = data?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: 'Nessun dato' });
    const timestamps = result.timestamp || [];
    const closes     = result.indicators?.quote?.[0]?.close || [];
    const points = timestamps.map((ts, i) => ({
      t: new Date(ts * 1000).toISOString().slice(0, 10),
      v: closes[i] != null ? parseFloat(closes[i].toFixed(4)) : null
    })).filter(p => p.v !== null);
    res.json({ ticker, points, currency: result.meta?.currency || '' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
