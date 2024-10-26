// src/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
 const authRoutes = require('./routes/authRoutes');
 const userRoutes = require('./routes/userRoutes');
 const resourceRoutes = require('./routes/resourceRoutes');
 const actionItemRoutes = require('./routes/actionItemRoutes');
// const trainingRoutes = require('./routes/trainingRoutes');
 const ktRoutes = require('./routes/ktPlanRoutes');
 const initialSetupRoutes = require("./routes/initialSetupRoutes")
// const communicationRoutes = require('./routes/communicationRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.use('/api/user', userRoutes);
app.use('/api/actionItem', actionItemRoutes);
// app.use('/api/trainings', trainingRoutes);
 app.use('/api/kt', ktRoutes);
 app.use('/api/initialSetup', initialSetupRoutes);
// app.use('/api/communication', communicationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});