const express = require('express');
const router = express.Router();

const videoSearchController = require('../controller/videoSearch');

const { isUserLoggedIn } = require('../middleware/middleware');

router.get('/get-video-search', isUserLoggedIn, videoSearchController.getVideoSearch);

module.exports = router;
