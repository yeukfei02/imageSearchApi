const express = require('express');
const router = express.Router();

const imageSearchController = require('../controller/imageSearch');

router.get('/get-image-search', imageSearchController.getImageSearch);

module.exports = router;
