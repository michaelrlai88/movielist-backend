const express = require('express');
const router = express.Router();
/* const db = require('../db'); */
const axios = require('axios');
const authorization = require('../middleware/authorization');
const { Pool } = require('pg');

if (process.env.DATABASE_URL) {
}

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : null
);

//route '/api/v1'

router.get('/', authorization, async (req, res) => {
  try {
    const client = await pool.connect();
    const response = await client.query(
      'SELECT email FROM users where id = $1',
      [req.user_id]
    );
    const disconnect = client.end();

    res.json(response.rows[0]);
  } catch (error) {
    const disconnect = client.end();
    console.log(error.message);
  }
});

router.get('/search', async (req, res) => {
  try {
    const { id, title } = req.query;

    //call to api for movie info by id
    if (id) {
      const response = await axios({
        method: 'get',
        url: `http://omdbapi.com/?apikey=${process.env.apiKey}&i=${id}`,
      });

      res.json(response.data);
    }
    //call to api for movie info by title
    else if (title) {
      const response = await axios({
        method: 'get',
        url: `http://omdbapi.com/?apikey=${process.env.apiKey}&t=${title}`,
      });

      res.json(response.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get('/movies', authorization, async (req, res) => {
  try {
    const client = await pool.connect();
    const response = await client.query(
      'SELECT * FROM movie_saves where user_id = $1',
      [req.user_id]
    );
    const disconnect = client.end();

    res.status(200).json(response.rows);
  } catch (error) {
    const disconnect = client.end();
    console.log(error.message);
  }
});

router.post('/movies', authorization, async (req, res) => {
  const { imdb_id, title, year, poster, plot, genre } = req.body;

  try {
    const client = await pool.connect();
    const checkExists = await client.query(
      'SELECT * FROM movie_saves WHERE user_ID = $1 AND title = $2',
      [req.user_id, title]
    );

    if (checkExists.rows[0]) {
      const disconnect = client.end();
      return res.status(400).json('Movie already added');
    }

    const response = await client.query(
      'INSERT INTO movie_saves(user_id, imdb_id, title, year, poster, plot, genre) values($1, $2, $3, $4, $5, $6, $7)',
      [req.user_id, imdb_id, title, year, poster, plot, genre]
    );
    const disconnect = client.end();
    res.json('Successfully added');
  } catch (error) {
    const disconnect = client.end();
    console.log(error.message);
  }
});

router.delete('/movies', authorization, async (req, res) => {
  const { imdb_id } = req.body;

  try {
    const client = await pool.connect();
    const response = await client.query(
      'DELETE FROM movie_saves WHERE user_id = $1 AND imdb_id = $2',
      [req.user_id, imdb_id]
    );
    const disconnect = client.end();
    res.json('Successfully deleted');
  } catch (error) {
    const disconnect = client.end();
    console.log(error.message);
  }
});

module.exports = router;
