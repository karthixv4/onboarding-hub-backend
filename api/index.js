const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('../src/routes/authRoutes');
const userRoutes = require('../src/routes/userRoutes');
const resourceRoutes = require('../src/routes/resourceRoutes');
const actionItemRoutes = require('../src/routes/actionItemRoutes');
const ktRoutes = require('../src/routes/ktPlanRoutes');
const initialSetupRoutes = require('../src/routes/initialSetupRoutes');
const verifyJWT = require('../src/middlewares/middlewares');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials to be sent
}));
app.use(cookieParser());
app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express on Vercel!' });
  });
// Protected Routes
app.use('/api/user', verifyJWT, userRoutes);
app.use('/api/resources', verifyJWT, resourceRoutes);
app.use('/api/actionItem', verifyJWT, actionItemRoutes);
app.use('/api/kt', verifyJWT, ktRoutes);
app.use('/api/initialSetup', verifyJWT, initialSetupRoutes);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

module.exports = app