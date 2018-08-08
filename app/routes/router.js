/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

/* API routes */
router.use('/roadmap', require('./api/roadmapRoutes'));
router.use('/project', require('./api/projectRoutes'));

module.exports = router;