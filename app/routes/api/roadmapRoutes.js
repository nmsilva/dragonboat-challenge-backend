/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const RoadmapController = require('../../controller/roadmapController');
const roadmapController = new RoadmapController();

/**
 * Car Entity routes
 */
router.get('/count', function (req, res) {
    roadmapController.countAll(res);
});

router.get('/exists/:id', function (req, res) {
    roadmapController.exists(req, res);
});

router.get('/:id', function (req, res) {
    roadmapController.findById(req, res);
});

router.get('/', function (req, res) {
    roadmapController.findAll(res);
});

router.put('/:id', function (req, res) {
    roadmapController.update(req, res);
});

router.post('/create', function (req, res) {
    roadmapController.create(req, res);
});

router.delete('/:id', function (req, res) {
    roadmapController.deleteById(req, res);
});

router.post('/:id/merge', function (req, res) {
    roadmapController.mergeToRoadmap(req, res);
});

module.exports = router;