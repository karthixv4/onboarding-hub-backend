const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const actionItemRoutes = require('./routes/actionItemRoutes');
const ktRoutes = require('./routes/ktPlanRoutes');
const initialSetupRoutes = require('./routes/initialSetupRoutes');
const verifyJWT = require('./middlewares/middlewares');
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

// Protected Routes
app.use('/api/user', verifyJWT, userRoutes);
app.use('/api/resources', verifyJWT, resourceRoutes);
app.use('/api/actionItem', verifyJWT, actionItemRoutes);
app.use('/api/kt', verifyJWT, ktRoutes);
app.use('/api/initialSetup', verifyJWT, initialSetupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
