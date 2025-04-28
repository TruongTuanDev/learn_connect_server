const express = require('express');
const router = express.Router();
const { getRecommendedFriends } = require('../controllers/recommendController');

router.get('/recommend-friends', getRecommendedFriends);

module.exports = router;
