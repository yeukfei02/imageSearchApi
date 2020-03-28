const videoSearchController = require('../controller/videoSearch');

module.exports.getVideoSearch = async (searchTerm) => {
  const resultList = await videoSearchController.getVideoSearchForTest(searchTerm);
  return resultList;
};
