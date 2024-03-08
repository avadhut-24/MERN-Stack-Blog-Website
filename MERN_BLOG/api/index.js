const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017')
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('hii');
});
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.create({ username, password });
  res.json({ message: 'Done' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let existingUser;
  existingUser = await User.findOne({ username });
  if (!existingUser) {
    console.log('Wrong username');
    res.status(400).json({ message: 'Wrong username' });
  }
  if (password != existingUser.password) {
    res.status(400).json({ message: 'wrong password' });
  }
  res.json({ message: 'Successfully logedin' });
});

app.listen(5000);
