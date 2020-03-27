const imageSearchController = require('../controller/imageSearch');

module.exports.getImageSearch = async (searchTerm) => {
  const resultList = await imageSearchController.getImageSearchForTest(searchTerm);
  return resultList;
};
