const mongoose = require('mongoose');
const _ = require('lodash');
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

async function toJson(obj) {
  return typeof obj.json === 'function' ? obj.json() : obj;
}

async function getUnsplashImage(searchTerm, resultList) {
  const unsplashResultRaw = await unsplash.search.photos(searchTerm);
  const unsplashResult = await toJson(unsplashResultRaw);
  if (!_.isEmpty(unsplashResult)) {
    let finalTagsList = [];
    if (!_.isEmpty(unsplashResult.results)) {
      unsplashResult.results.forEach((item, i) => {
        let obj = {};
        obj.image_id = item.id;
        obj.thumbnails = item.urls.thumb;
        obj.preview = item.urls.full;
        obj.title = item.description ? item.description : '';
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

    if (!_.isEmpty(pixabayResult.hits)) {
      pixabayResult.hits.forEach((item, i) => {
        let obj = {};
        obj.image_id = item.id.toString();
        obj.thumbnails = item.previewURL;
        obj.preview = item.webformatURL;
        obj.title = '';
        obj.source = 'Pixabay';
        obj.tags = finalTagsList;

        if (!_.isEmpty(obj)) resultList.push(obj);
      });
    }
  }
}

async function addImageSearchToDB(data) {
  const imageSearch = ImageSearch({
    _id: mongoose.Types.ObjectId(),
    image_id: data.image_id,
    thumbnails: data.thumbnails,
    preview: data.preview,
    title: data.title,
    source: data.source,
    tags: data.tags,
  });

  const result = await imageSearch.save();
  return result;
}

async function getImageSearchFromDBById(imageId) {
  const imageSearch = await ImageSearch.findOne({ image_id: imageId });
  return imageSearch;
}

module.exports.getImageSearch = async (req, res) => {
  const searchTerm = req.query.searchTerm;

  let resultList = [];

  const userLoginStatus = common.checkUserLogin(req, res);
  if (userLoginStatus) {
    await getUnsplashImage(searchTerm, resultList);
    await getPixabayImage(searchTerm, resultList);

    if (!_.isEmpty(resultList)) {
      resultList.forEach(async (item, i) => {
        const imageSearchFromDB = await getImageSearchFromDBById(item.image_id);
        if (_.isEmpty(imageSearchFromDB)) await addImageSearchToDB(item);
      });
    }

    res.status(200).json(resultList);
  }
};

module.exports.getImageSearchForTest = async (searchTerm) => {
  let resultList = [];

  await getUnsplashImage(searchTerm, resultList);
  await getPixabayImage(searchTerm, resultList);

  return resultList;
};
