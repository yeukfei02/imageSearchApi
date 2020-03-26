const mongoose = require('mongoose');
const _ = require('lodash');
const axios = require('axios');
const fetch = require('node-fetch');
global.fetch = fetch;

// unsplash
const Unsplash = require('unsplash-js').default;
const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_API_KEY });

// pixabay
const Pixabay = require('pixabay-api');
const pixabay = Pixabay.authenticate(process.env.PIXABAY_API_KEY);

const common = require('../common/common');
const ImageSearch = require('../model/imageSearch');

async function getResultRaw(obj) {
  return typeof obj.json === 'function' ? obj.json() : obj;
}

async function getUnsplashImage(searchTerm, resultList) {
  const unsplashResultRaw = await unsplash.search.photos(searchTerm);
  const unsplashResult = await getResultRaw(unsplashResultRaw);
  if (!_.isEmpty(unsplashResult)) {
    let finalTagsList = [];
    unsplashResult.results.forEach((item, i) => {
      let obj = {};
      obj.image_id = item.id;
      obj.thumbnails = item.urls.thumb;
      obj.preview = item.urls.full;
      obj.title = item.description;
      obj.source = 'Unsplash';

      if (!_.isEmpty(item.tags)) {
        const tagsList = item.tags.map((item, i) => {
          return item.title;
        });
        const formattedTagsList = tagsList.join(',').split(',');
        const uniqTagsList = _.uniq(formattedTagsList);
        if (!_.isEmpty(uniqTagsList)) {
          uniqTagsList.forEach((item, i) => {
            if (!finalTagsList.includes(item)) finalTagsList.push(item);
          });
        }
      }
      obj.tags = finalTagsList;

      if (!_.isEmpty(obj)) resultList.push(obj);
    });
  }
}

async function getPixabayImage(searchTerm, resultList) {
  const pixabayResult = await pixabay.searchImages(searchTerm);
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

    pixabayResult.hits.forEach((item, i) => {
      let obj = {};
      obj.image_id = item.id;
      obj.thumbnails = item.previewURL;
      obj.preview = item.webformatURL;
      obj.title = '';
      obj.source = 'Pixabay';
      obj.tags = finalTagsList;

      if (!_.isEmpty(obj)) resultList.push(obj);
    });
  }
}

module.exports.getImageSearch = async (req, res) => {
  const searchTerm = req.query.searchTerm;

  let resultList = [];

  const userLoginStatus = common.checkUserLogin(req, res);
  if (userLoginStatus) {
    await getUnsplashImage(searchTerm, resultList);

    await getPixabayImage(searchTerm, resultList);

    res.status(200).json({
      resultList: resultList,
    });
  }
};
