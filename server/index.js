require('dotenv').config();
const express = require('express');
const path = require('path');
const Routers = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/reviews', Routers);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});