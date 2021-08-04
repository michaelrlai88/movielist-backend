require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

const auth = require('./routes/auth');
const api = require('./routes/api');

const corsOptions = {
  origin: ['https://movielist88.vercel.app', 'http://http://localhost:3000'],
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/auth', auth);
app.use('/api/v1', api);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
