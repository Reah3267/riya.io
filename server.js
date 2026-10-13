const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/login_app';
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('Missing JWT_SECRET environment variable. Set it before starting the server.');
  process.exit(1);
}

// Configure middleware
app.use(bodyParser.json());

// Define a User schema and model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Define routes for login and registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || password.length < 8) {
      return res.status(400).send('Provide a username and a password of at least 8 characters.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username: username.trim(), password: hashedPassword });
    await user.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).send('That username is already registered.');
    }
    console.error('Registration failed:', error.message);
    res.status(500).send('Error registering user.');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).send('Provide a username and password.');
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(401).send('Invalid username or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid username or password.');
    }

    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).send('Error logging in.');
  }
});

// Connect to MongoDB before accepting requests.
mongoose.connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  });
