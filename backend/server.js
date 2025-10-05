const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const JWT_SECRET = 'your_secret_key_here'; // replace with strong secret
const USERS_FILE = path.join(__dirname, 'users.json');
const JOBS_FILE = path.join(__dirname, 'jobs.json'); // make sure you have jobs.json

// ------------------ Middleware ------------------
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // your React frontend
  credentials: true
}));

// ------------------ Users helpers ------------------
function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, '[]', 'utf-8'); // create if missing
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users:', err);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ------------------ JWT middleware ------------------
function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error_msg: 'Token not provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error_msg: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ------------------ Registration ------------------
app.post('/users/register', async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error_msg: 'All fields are required' });
  }

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error_msg: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    name,
    role: 'PRIME_USER'
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// ------------------ Login ------------------
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error_msg: 'All fields are required' });

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error_msg: 'User not found. Please signup first.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error_msg: 'Invalid password' });

  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1y' });
  res.cookie('token', token, { httpOnly: false, maxAge: 3600000 }); // 1 hour
  res.json({ message: 'Login successful', token });
});

// ------------------ Profile ------------------
app.get('/users/profile', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ error_msg: 'User not found' });

  res.json({
    profile_details: {
      name: user.name,
      username: user.username,
      role: user.role,
      profile_image_url: 'https://assets.ccbp.in/frontend/react-js/male-avatar-img.png',
      short_bio: 'Lead Software Developer & AI/ML enthusiast'
    }
  });
});

// ------------------ Jobs ------------------
let jobs = [];
if (fs.existsSync(JOBS_FILE)) {
  jobs = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf-8'));
}

// Get all jobs with optional filters
app.get('/jobs', authenticateToken, (req, res) => {
  let filteredJobs = [...jobs];
  const { employment_type, minimum_package, search } = req.query;

  // Filter by employment type
  if (employment_type) {
    const types = employment_type.split(',');
    filteredJobs = filteredJobs.filter(job =>
      types.includes(job.employment_type.replace(/\s+/g, '').toUpperCase())
    );
  }

  // Filter by minimum package
  if (minimum_package) {
    const minPackage = parseInt(minimum_package, 10);
    filteredJobs = filteredJobs.filter(job => {
      const jobPackage = parseFloat(job.package_per_annum.replace(/\s*LPA/i, '')) * 1000000;
      return jobPackage >= minPackage;
    });
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(searchLower) ||
      job.job_description.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower)
    );
  }

  res.json({ jobs: filteredJobs, total: filteredJobs.length });
});

app.get("/jobs/:id", (req, res) => {
  const { id } = req.params;
  const job = jobs.find(j => j.id === parseInt(id));
  if (!job) return res.status(404).json({ error: "Job not found" });

  const similarJobs = jobs.filter(j => j.id !== parseInt(id)).slice(0, 3);
  res.json({ job_details: job, similar_jobs: similarJobs });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));