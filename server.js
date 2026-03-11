const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// ── PROXY ANTHROPIC ────────────────────────────────────────
app.post('/api/claude', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(400).json({ error: 'API key mancante.' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
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
// GET /api/prices?tickers=AAPL,MSFT,ENI.MI
app.get('/api/prices', async (req, res) => {
  const tickers = (req.query.tickers || '').split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
  if (!tickers.length) return res.status(400).json({ error: 'Nessun ticker specificato' });

  const results = {};

  await Promise.all(tickers.map(async (ticker) => {
    try {
      // Yahoo Finance v8 chart endpoint — free, no auth needed
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
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
          name:     meta.shortName || meta.longName || ticker,
          market:   meta.exchangeName || '',
          timestamp: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null
        };
      } else {
        results[ticker] = { price: null, error: 'Dati non trovati' };
      }
    } catch (e) {
      results[ticker] = { price: null, error: e.message };
    }
  }));

  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ APEX TRADER in ascolto sulla porta ${PORT}`);
});
