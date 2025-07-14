const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get(
      'https://newsapi.org/v2/top-headlines?country=us&apiKey=6426f22f97284b06b93c0c0c742813d3'
    );
    res.json(response.data);
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(500).json({ error: 'News fetch failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
