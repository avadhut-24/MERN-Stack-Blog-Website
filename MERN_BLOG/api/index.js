const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('./models/postModel');

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

const saltRound = 10;
const secret = 'sddsgsg1sdvdsvldsfsdglkdsfasdfasdgas';

mongoose
  .connect('mongodb://localhost:27017')
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  let existingUser;
  existingUser = await User.findOne({ username });
  if (existingUser) {
    console.log(existingUser);
    return res.status(400).json({ message: 'user already exists' });
  }

  const hash_password = await bcrypt.hash(password, saltRound);
  const userDoc = await User.create({ username, password: hash_password });
  res.json({ userDoc });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let existingUser;
  existingUser = await User.findOne({ username });
  if (!existingUser) {
    return res.status(400).json({ message: 'wrong username' });
  }

  const pass = bcrypt.compareSync(password, existingUser.password);
  if (pass) {
    //loggedin
    jwt.sign({ username, id: existingUser._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token);
      res.json({
        id: existingUser._id,
        username
      });
    });
  } else {
    // alert('wrong password');
    return res.status(400).json({ message: 'wrong password' });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { title, summary, content } = req.body;

  const postDoc = await Post.create({
    title,
    summary,
    content,
    cover: newPath
  });

  res.json(postDoc);
});

app.listen(5000);
