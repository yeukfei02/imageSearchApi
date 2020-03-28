const express = require('express');
const router = express.Router();

const videoSearchController = require('../controller/videoSearch');

router.get('/get-video-search', videoSearchController.getVideoSearch);

module.exports = router;
