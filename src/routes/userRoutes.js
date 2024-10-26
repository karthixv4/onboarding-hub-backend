const express = require('express');
const { getUserDetails, getAllUsers } = require('../controllers/userController')

const router = express.Router();
router.get('/all', getAllUsers);
router.get('/:id', getUserDetails); // New route for fetching user details



module.exports = router;