require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

const auth = require('./routes/auth');
const api = require('./routes/api');

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/auth', auth);
app.use('/api/v1', api);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
