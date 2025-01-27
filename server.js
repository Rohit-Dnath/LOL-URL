const express = require('express');
const path = require('path');
const app = express();

// ...existing code...

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle custom routes
app.get('/custom/:link', (req, res) => {
  const customLink = req.params.link;
  // Add your custom link handling logic here
  // For example, you can redirect to a specific page based on the custom link
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// ...existing code...

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server is running on port ${port}`);
