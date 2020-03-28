const mongoose = require('mongoose');
const _ = require('lodash');
const axios = require('axios');

const env = require('dotenv');
env.config();

const common = require('../common/common');
const VideoSearch = require('../model/videoSearch');

async function searchVideos(searchTerm) {
  const result = await axios.get(`https://pixabay.com/api/videos`, {
    params: {
      key: process.env.PIXABAY_API_KEY,
      q: searchTerm,
    },
  });
  return result.data;
}

async function getPixabayVideo(searchTerm) {
  let result = [];

  const pixabayResult = await searchVideos(searchTerm);
  if (!_.isEmpty(pixabayResult)) {
    const tagsList = pixabayResult.hits.map((item, i) => {
      return item.tags;
    });
    const formattedTagsList = tagsList.join(',').split(',');
    const uniqTagsList = _.uniq(formattedTagsList);

    let finalTagsList = [];
    if (!_.isEmpty(uniqTagsList)) {
      finalTagsList = uniqTagsList.map((item, i) => {
        return item.trim();
      });
    }

    if (!_.isEmpty(pixabayResult.hits)) {
      result = pixabayResult.hits.map((item, i) => {
        let obj = {};
        obj.video_id = item.id.toString();
        obj.type = item.type;
        obj.videos = item.videos;
        obj.source = 'Pixabay';
        obj.tags = finalTagsList;
        obj.views = item.views;
        obj.downloads = item.downloads;

        return obj;
      });
    }
  }

  return result;
}

async function addVideoSearchToDB(data) {
  const videoSearch = VideoSearch({
    _id: mongoose.Types.ObjectId(),
    video_id: data.video_id,
    type: data.type,
    videos: data.videos,
    source: data.source,
    tags: data.tags,
    views: data.views,
    downloads: data.downloads,
  });

  const result = await videoSearch.save();
  return result;
}

async function getVideoSearchFromDBById(videoId) {
  const videoSearch = await VideoSearch.findOne({ video_id: videoId });
  return videoSearch;
}

module.exports.getVideoSearch = async (req, res) => {
  const searchTerm = req.query.searchTerm;

  const userLoginStatus = common.checkUserLogin(req, res);
  if (userLoginStatus) {
    const resultList = await getPixabayVideo(searchTerm);
    if (!_.isEmpty(resultList)) {
      resultList.forEach(async (item, i) => {
        if (!_.isEmpty(item) && !_.isEmpty(item.video_id)) {
          const videoSearchFromDB = await getVideoSearchFromDBById(item.video_id);
          if (_.isEmpty(videoSearchFromDB)) await addVideoSearchToDB(item);
        }
      });
    }

    res.status(200).json(resultList);
  }
};

module.exports.getVideoSearchForTest = async (searchTerm) => {
  const resultList = await getPixabayVideo(searchTerm);
  return resultList;
};
