const mongoose = require('mongoose');
const _ = require('lodash');
const axios = require('axios');
const crypto = require('crypto');
const fetch = require('node-fetch');
global.fetch = fetch;

const env = require('dotenv');
env.config();

// unsplash
const Unsplash = require('unsplash-js').default;
const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_API_KEY });

// pixabay
const Pixabay = require('pixabay-api');
const pixabay = Pixabay.authenticate(process.env.PIXABAY_API_KEY);

// storyblocks
const baseUrl = 'https://api.graphicstock.com';
const searchUri = '/api/v1/stock-items/search/';
const storyblocksUrl = `${baseUrl}${searchUri}`;

const ImageSearch = require('../model/imageSearch');

async function toJson(obj) {
  return typeof obj.json === 'function' ? obj.json() : obj;
}

async function getUnsplashImage(searchTerm) {
  let result = [];

  const unsplashResultRaw = await unsplash.search.photos(searchTerm);
  const unsplashResult = await toJson(unsplashResultRaw);
  if (!_.isEmpty(unsplashResult)) {
    let finalTagsList = [];
    if (!_.isEmpty(unsplashResult.results)) {
      result = unsplashResult.results.map((item, i) => {
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

        return obj;
      });
    }
  }

  return result;
}

async function getPixabayImage(searchTerm) {
  let result = [];

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
      result = pixabayResult.hits.map((item, i) => {
        let obj = {};
        obj.image_id = item.id.toString();
        obj.thumbnails = item.previewURL;
        obj.preview = item.largeImageURL;
        obj.title = '';
        obj.source = 'Pixabay';
        obj.tags = finalTagsList;

        return obj;
      });
    }
  }

  return result;
}

async function getStoryblocksImage(searchTerm) {
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
        obj.image_id = item.id.toString();
        obj.thumbnails = item.thumbnail_url;
        obj.preview = item.preview_url;
        obj.title = item.title;
        obj.source = 'Storyblocks';
        obj.tags = item.keywords.split(',');

        return obj;
      });
    }
  }

  return result;
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
  const list = await getUnsplashImage(searchTerm);
  const list2 = await getPixabayImage(searchTerm);
  const list3 = await getStoryblocksImage(searchTerm);
  resultList.push(list);
  resultList.push(list2);
  resultList.push(list3);

  if (!_.isEmpty(resultList)) {
    resultList.forEach((listItem, i) => {
      if (!_.isEmpty(listItem)) {
        listItem.forEach(async (item, i) => {
          if (!_.isEmpty(item) && !_.isEmpty(item.image_id)) {
            const imageSearchFromDB = await getImageSearchFromDBById(item.image_id);
            if (_.isEmpty(imageSearchFromDB)) await addImageSearchToDB(item);
          }
        });
      }
    });
  }

  const finalResultList = resultList[0].flatMap((o, i) => [...resultList.map((a) => a[i])]);
  res.status(200).json(finalResultList);
};

module.exports.getImageSearchForTest = async (searchTerm) => {
  let resultList = [];

  const list = await getUnsplashImage(searchTerm);
  const list2 = await getPixabayImage(searchTerm);
  const list3 = await getStoryblocksImage(searchTerm);
  resultList.push(list);
  resultList.push(list2);
  resultList.push(list3);

  return resultList;
};
