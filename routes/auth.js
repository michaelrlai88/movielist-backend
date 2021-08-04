const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwtGet = require('../utils/jwtGet');
const authorization = require('../middleware/authorization');

// - /auth - route

//Register endpoint
router.post(
  '/signup',
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 3 })
    .withMessage('Please enter a valid password'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      //Check if user('s email) exists in db
      const checkUser = await db.query(
        'SELECT email FROM users WHERE email = $1',
        [email]
      );
      //Status 401 if user already exists
      if (checkUser.rows[0]) {
        return res.status(401).json({
          errors: [
            {
              param: 'duplicate',
              msg: 'Email address already exists',
            },
          ],
        });
      }

      //Else if user does not exist, generate hash
      const saltRounds = 12;
      const hash = await bcrypt.hash(password, saltRounds);

      //Insert user's email and hash into db
      const insertUser = await db.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        [email, hash]
      );

      //Generate jwt token and include in response object
      const token = jwtGet(insertUser.rows[0].id);
      res.json({ token });

      //
    } catch (error) {
      console.log(error.message);
    }
  }
);

//Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user('s email) exists in db
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    //Status 401 if user does not exist in db
    if (!checkUser.rows[0]) {
      return res.status(401).json('Email or password incorrect');
    }

    //If user does exist, check password against hash in db
    const checkPassword = await bcrypt.compare(
      password,
      checkUser.rows[0].password
    );

    //If password incorrect, status 401
    if (!checkPassword) {
      return res.status(401).json('Email or password incorrect');
    }

    //If password is correct, generate jwt token and return in response
    const token = jwtGet(checkUser.rows[0].id);
    res.json({ token });

    //
  } catch (error) {
    console.log(error.message);
  }
});

//Auth check endpoint, for frontend refresh
router.get('/check', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
