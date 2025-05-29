const express = require('express');
const router = express.Router();
const { getRecommendedFriends, AddFriend, RemoveFriend } = require('../controllers/recommendController');

router.get('/recommend-friends', getRecommendedFriends);
router.post('/friend/add', AddFriend);
router.post('/friend/remove', RemoveFriend);

module.exports = router;
