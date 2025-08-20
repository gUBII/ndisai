const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/query', (req, res) => {
  const text = req.body?.text || '';
  res.json({ reply: `You said: ${text}` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
