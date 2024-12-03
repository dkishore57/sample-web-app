const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));  // Adjusted path to serve frontend

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// CORS headers for cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kishored2005',
  database: 'fullstack_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Serve the root route (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));  // Adjusted path
});


// API route to add a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Simple validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Check if the email already exists in the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate email:', err);
      return res.status(500).json({ error: 'Failed to check for duplicate email' });
    }

    if (results.length > 0) {
      // Email already exists, return an error message
      return res.status(400).json({ error: 'Email already registered' });
    } else {
      // No duplicate email, proceed with inserting the new user
      db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Failed to add user' });
        }
        res.status(201).send('User added');
      });
    }
  });
});

// API route to delete a user by ID


// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
