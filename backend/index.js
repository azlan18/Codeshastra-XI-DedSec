const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Pinecone } = require('@pinecone-database/pinecone');
const { HfInference } = require('@huggingface/inference');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mockDataRoutes = require('./routes/mockDataRoutes');
const apiRoutes = require("./routes/api");
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize external services
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const hf = new HfInference(process.env.HF_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.locals.pinecone = pinecone;
app.locals.hf = hf;
app.locals.genAI = genAI;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mock', mockDataRoutes);


//sahil ka code//
app.use("/api", apiRoutes);
//sahil ka code//


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});