const mongoose = require('mongoose');
const _ = require('lodash');
const axios = require('axios');
const crypto = require('crypto');

// storyblocks
const baseUrl = 'https://api.videoblocks.com';
const searchUri = '/api/v1/stock-items/search/';
const storyblocksUrl = `${baseUrl}${searchUri}`;

const env = require('dotenv');
env.config();

const common = require('../common/common');
const VideoSearch = require('../model/videoSearch');

async function getPixabayVideo(searchTerm) {
  let result = [];

  const pixabayResult = await axios.get(`https://pixabay.com/api/videos`, {
    params: {
      key: process.env.PIXABAY_API_KEY,
      q: searchTerm,
    },
  });
  if (!_.isEmpty(pixabayResult)) {
    const tagsList = pixabayResult.data.hits.map((item, i) => {
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

    if (!_.isEmpty(pixabayResult.data.hits)) {
      result = pixabayResult.data.hits.map((item, i) => {
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

async function getStoryblocksVideo(searchTerm) {
  let result = [];

  const expires = Math.floor(Date.now() / 1000);
  const hmacBuilder = crypto.createHmac('sha256', process.env.STORY_BLOCKS_PRIVATE_KEY + expires);
  hmacBuilder.update(searchUri);
  const hmac = hmacBuilder.digest('hex');

  const storyBlocksResult = await axios.get(`${storyblocksUrl}`, {
    params: {
      keywords: searchTerm,
      page: 1,
      num_results: 20,
      APIKEY: process.env.STORY_BLOCKS_PUBLIC_KEY,
      EXPIRES: expires,
      HMAC: hmac,
    },
  });

  if (!_.isEmpty(storyBlocksResult)) {
    if (!_.isEmpty(storyBlocksResult.data.info)) {
      result = storyBlocksResult.data.info.map((item, i) => {
        let obj = {};
        obj.video_id = item.id.toString();
        obj.type = item.type;

        const videos = {
          preview_urls: item.preview_urls,
          preview_url: item.preview_url,
          preview_url_small: item.preview_url_small,
        };
        obj.videos = videos;
        obj.source = 'Storyblocks';
        obj.tags = item.keywords.split(',');
        obj.views = null;
        obj.downloads = null;

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
    let resultList = [];
    const list = await getPixabayVideo(searchTerm);
    const list2 = await getStoryblocksVideo(searchTerm);
    resultList.push(list);
    resultList.push(list2);

    if (!_.isEmpty(resultList)) {
      resultList.forEach(async (listItem, i) => {
        if (!_.isEmpty(listItem)) {
          listItem.forEach(async (item, i) => {
            if (!_.isEmpty(item) && !_.isEmpty(item.video_id)) {
              const videoSearchFromDB = await getVideoSearchFromDBById(item.video_id);
              if (_.isEmpty(videoSearchFromDB)) await addVideoSearchToDB(item);
            }
          });
        }
      });
    }

    const finalResultList = resultList[0].flatMap((o, i) => [...resultList.map((a) => a[i])]);
    res.status(200).json(finalResultList);
  }
};

module.exports.getVideoSearchForTest = async (searchTerm) => {
  let resultList = [];

  const list = await getPixabayVideo(searchTerm);
  const list2 = await getStoryblocksVideo(searchTerm);
  resultList.push(list);
  resultList.push(list2);

  return resultList;
};
