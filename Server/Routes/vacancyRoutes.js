const express = require('express');
const multer = require('multer');
const vacancyController = require('../Controller/vacancyController');
const upload=require('../config/upload')
const router = express.Router();



// Routes
router.post('/', upload.single('file'), vacancyController.createVacancy); // Create vacancy with file
router.get('/', vacancyController.getAllVacancies); // Get all
router.get('/search', vacancyController.searchVacanciesByDate); // Search by date
router.delete('/:id', vacancyController.deleteVacancy);
module.exports = router;