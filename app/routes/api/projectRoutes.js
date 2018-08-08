/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const ProjectController = require('../../controller/projectController');
const projectController = new ProjectController();

/**
 * Project Entity routes
 */
router.get('/count', function (req, res) {
    projectController.countAll(res);
});

router.get('/exists/:id', function (req, res) {
    projectController.exists(req, res);
});

router.get('/:id', function (req, res) {
    projectController.findById(req, res)
});

router.get('/', function (req, res) {
    projectController.findAll(res);
});

router.put('/:id', function (req, res) {
    projectController.update(req, res)
});

router.post('/create', function (req, res) {
    projectController.create(req, res);
});

router.delete('/:id', function (req, res) {
    projectController.deleteById(req, res)
});

module.exports = router;