/* eslint-disable */
const express = require('express');
const cors = require('cors');
const { adminRouter } = require('../../build');

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/', adminRouter);

app.listen(PORT, () => {
  console.log('');
  console.log(`SQLite 95 ready! ✨`);
  console.log('');
  console.log(`http://localhost:${PORT}`);
  console.log('');
});
