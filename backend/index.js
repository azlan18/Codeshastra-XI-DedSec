const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Pinecone } = require('@pinecone-database/pinecone');
const { HfInference } = require('@huggingface/inference');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('./config/passport');

// Import routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mockDataRoutes = require('./routes/mockDataRoutes');
const apiRoutes = require("./routes/api");
const authRoutes = require('./routes/auth');
const refreshRoutes = require('./routes/refresh');
const meetRoutes = require('./routes/meet');
const ticketRoutes = require('./routes/tickets');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({ secret: process.env.SESSION_SECRET || "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Initialize external services
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const hf = new HfInference(process.env.HF_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Initialize passport configuration
const users = passportConfig(passport);

// Make services available to all routes
app.locals.pinecone = pinecone;
app.locals.hf = hf;
app.locals.genAI = genAI;
app.locals.users = users;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mock', mockDataRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshRoutes);
app.use('/create-meet', meetRoutes);
app.use('/tickets', ticketRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send('✅ Server is running. Use /auth to login.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for testing purposes
module.exports = app;