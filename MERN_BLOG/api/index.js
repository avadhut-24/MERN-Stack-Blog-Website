const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/postModel');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs'); //File System

//middlewares
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

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

  if (!token) {
    //If user not loggedin then we don't get any token
    return res.json('Not loggedin');
  }
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

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id
    });
    res.json(postDoc);
  });
});

app.get('/post', async (req, res) => {
  const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20);
  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postInfo = await Post.findById(id).populate('author', ['username']);
  res.json(postInfo);
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover
    });

    res.json(postDoc);
  });
});

app.listen(5000);
