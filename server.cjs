const express = require('express');
const path = require('path');
const cors = require('cors'); // For handling CORS requests
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: '*'  // You can change '*' to the specific frontend domain if needed
}));

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Wildcard route to serve "index.html" for any route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
