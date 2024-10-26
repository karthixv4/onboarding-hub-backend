const express = require('express');
const actionController = require('../controllers/actionItemController');

const router = express.Router();

// Routes for ActionItem CRUD operations
router.post('/', actionController.createActionItem);
router.get('/', actionController.getAllActionItems);
router.get('/:id', actionController.getActionItemById);
router.put('/:id', actionController.updateActionItem);
router.delete('/:id', actionController.deleteActionItem);

module.exports = router;
