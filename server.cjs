const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for API requests
app.use(cors());

// Enable GZIP compression for all responses
app.use(compression());

// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y', // Cache static files for 1 year
  immutable: true,
}));

// Handle API requests
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// SPA fallback to serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
