const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');

// GET /api/matches/:userId - Lấy danh sách ghép đôi
router.get('/:userId', matchController.getMatches);

module.exports = router;