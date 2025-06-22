const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./db.js');
const bcrypt = require('bcrypt')


dotenv.config();
const app = express();
app.use(express.json()); //need this to read POST bodies
const PORT = 3000;



//middleware
app.use(cors());
app.use(express.json());

//compliment route
app.get('/api/compliment', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, text FROM compliments ORDER BY RANDOM() LIMIT 1');
      res.json({ compliment: result.rows[0].text, id: result.rows[0].id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
      );
  
      res.status(201).json({ user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed.' });
    }
  });

//login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed.' });
    }
  });

//favorites route POST
app.post('/favorites', async (req, res) => {
    const { userId, complimentId } = req.body;
  
    try {
      // ✅ Check if this specific user already saved this compliment
      const existing = await pool.query(
        'SELECT * FROM favorites WHERE user_id = $1 AND compliment_id = $2',
        [userId, complimentId]
      );
  
      if (existing.rows.length > 0) {
        return res.status(409).json({ message: 'Already saved' });
      }
  
      const result = await pool.query(
        'INSERT INTO favorites (user_id, compliment_id) VALUES ($1, $2) RETURNING *',
        [userId, complimentId]
      );
  
      res.status(201).json({ favorite: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save favorite' });
    }
  });
  

//favorites route GET
app.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params; // ← this was missing in your code
  
    try {
      const result = await pool.query(
        `
        SELECT compliments.text
        FROM favorites
        JOIN compliments ON compliments.id = favorites.compliment_id
        WHERE favorites.user_id = $1
        `,
        [userId]
      );
  
      res.json({ favorites: result.rows }); // send results back to client
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  });
  


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));