require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running Balram🚀' });
});

app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;
