// src/routes/resourceRoutes.js

const express = require('express');
const {
    getAllResources,
    addResource,
    getResourceById,
    updateResource,
    deleteResource,
    getAllResourcesWithKT,
} = require('../controllers/resourceController');
const router = express.Router();

router.get('/withKT', getAllResourcesWithKT);
router.get('/', getAllResources);
router.post('/', addResource);
 router.get('/:id', getResourceById);
 router.put('/:id', updateResource);
 router.delete('/:id', deleteResource);
 
module.exports = router;