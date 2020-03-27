
const env = require('dotenv');
env.config();

const imageSearchController = require('../controller/imageSearch');

module.exports.getImageSearch = async (searchTerm) => {
  let resultList = [];

  await imageSearchController.getUnsplashImageForTest(searchTerm, resultList);

  await imageSearchController.getPixabayImageForTest(searchTerm, resultList);

  return resultList;
};
