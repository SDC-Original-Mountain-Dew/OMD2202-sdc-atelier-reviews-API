require('dotenv').config();
require('newrelic');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Routers = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/reviews', Routers);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});