const express = require('express');
const ktPlanController = require('../controllers/ktPlanController');

const router = express.Router();

// Routes for KT Plan CRUD operations
router.post('/', ktPlanController.createKTPlan);
router.get('/', ktPlanController.getAllKTPlans);
router.get('/:id', ktPlanController.getKTPlanById);
router.put('/:id', ktPlanController.updateKTPlan);
router.delete('/:id', ktPlanController.deleteKTPlan);

module.exports = router;
