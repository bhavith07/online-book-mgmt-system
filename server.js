import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to your Express HTTP Server!');
});

app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running smoothly',
    timestamp: new Date()
  });
});


app.post('/api/data', (req, res) => {
  const receivedData = req.body;
  res.status(201).json({
    message: 'Data received successfully',
    data: receivedData
  });
});

app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(PORT, () => {
  console.log(`HTTP Server is listening at http://localhost:${PORT}`);
});
