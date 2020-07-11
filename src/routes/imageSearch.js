const express = require('express');
const router = express.Router();

const imageSearchController = require('../controller/imageSearch');

const { isUserLoggedIn } = require('../middleware/middleware');

router.get('/get-image-search', isUserLoggedIn, imageSearchController.getImageSearch);

module.exports = router;
