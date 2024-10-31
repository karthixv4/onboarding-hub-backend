const express = require('express');
const initialSetupController = require('../controllers/initialSetupController');

const router = express.Router();

// Routes for KT Plan CRUD operations
router.get('/resource/:id', initialSetupController.getInitialSetupsByUser);
router.post('/', initialSetupController.createInitialSetup);
router.get('/', initialSetupController.getAllInitialSetups);
router.get('/:id', initialSetupController.getInitialSetupById);
router.put('/:id', initialSetupController.updateInitialSetup);
router.delete('/:id', initialSetupController.deleteInitialSetup);

module.exports = router;
