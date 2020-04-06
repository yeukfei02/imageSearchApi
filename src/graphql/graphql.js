const { buildSchema } = require('graphql');
const imageSearch = require('../controller/imageSearch');
const videoSearch = require('../controller/videoSearch');

const schema = buildSchema(`
  type Query {
    image(imageId: String, searchTerm: String): Image
    images(searchTerm: String): [Image]
    video(videoId: String, searchTerm: String): Video
    videos(searchTerm: String): [Video]
  },
  type Image {
    image_id: String
    thumbnails: String
    preview: String
    title: String
    source: String
    tags: [String]
  }
  type Video {
    video_id: String
    type: String
    videos: VideoItem
    source: String
    tags: [String]
    views: Int,
    downloads: Int
  }
  type VideoItem {
    videoItemDetails: VideoItemDetails
  },
  type VideoItemDetails {
    url: String,
    width: Int,
    height: Int,
    size: Int
  }
`);

const getImagesList = async (searchTerm) => {
  const imagesList = await imageSearch.getImageSearchForTest(searchTerm);
  return imagesList;
}

const getVideosList = async (searchTerm) => {
  const videosList = await videoSearch.getVideoSearchForTest(searchTerm);
  return videosList;
}

/*
- graphql query
query getImage($imageId: String, $searchTerm: String) {
  image(imageId: $imageId, searchTerm: $searchTerm) {
    image_id
    thumbnails
    preview
    title
    source
    tags
  }
}

- query varable
{
	"imageId": "4hluhoRJokI",
  "searchTerm": "hong kong"
}
*/
const getImage = async (args) => {
  let resultList = [];

  const imageId = args.imageId;
  const searchTerm = args.searchTerm;

  const imagesList = await getImagesList(searchTerm);
  if (imagesList) {
    imagesList.forEach((listItem, i) => {
      if (listItem) {
        listItem.forEach((item, i) => {
          if (item) {
            resultList.push(item);
          }
        });
      }
    });
  }

  let result = null;
  if (resultList) {
    const filterResult = resultList.filter((item, i) => {
      return item.image_id === imageId;
    });
    if (filterResult && filterResult.length === 1)
      result = filterResult[0];
  }
  return result;
}

/*
- graphql query
query getImages($searchTerm: String) {
  images(searchTerm: $searchTerm) {
    image_id
    thumbnails
    preview
    title
    source
    tags
  }
}

- query varable
{
  "searchTerm": "hong kong"
}
*/
const getImages = async (args) => {
  let resultList = [];

  const searchTerm = args.searchTerm;

  const imagesList = await getImagesList(searchTerm);
  if (imagesList) {
    imagesList.forEach((listItem, i) => {
      if (listItem) {
        listItem.forEach((item, i) => {
          if (item) {
            resultList.push(item);
          }
        });
      }
    });
  }

  return resultList;
}

/*
- graphql query
query getVideo($videoId: String, $searchTerm: String) {
  video(videoId: videoId, searchTerm: $searchTerm) {
    video_id
    type
    videos
    source
    tags
    views
    downloads
  }
}

- query varable
{
	"videoId": "2849",
  "searchTerm": "hong kong"
}
*/
const getVideo = async (args) => {
  let resultList = [];

  const videoId = args.videoId;
  const searchTerm = args.searchTerm;

  const videosList = await getVideosList(searchTerm);
  if (videosList) {
    videosList.forEach((listItem, i) => {
      if (listItem) {
        resultList.push(listItem);
      }
    });
  }

  let result = null;
  if (resultList) {
    const filterResult = resultList.filter((item, i) => {
      return item.video_id === videoId;
    });
    if (filterResult && filterResult.length === 1)
      result = filterResult[0];
  }
  return result;
}

/*
- graphql query
query getVideos($searchTerm: String) {
  videos(searchTerm: $searchTerm) {
    video_id
    type
    videos
    source
    tags
    views
    downloads
  }
}

- query varable
{
  "searchTerm": "hong kong"
}
*/
const getVideos = async (args) => {
  let resultList = [];

  const searchTerm = args.searchTerm;

  const videosList = await getVideosList(searchTerm);
  if (videosList) {
    videosList.forEach((listItem, i) => {
      if (listItem) {
        resultList.push(listItem);
      }
    });
  }

  return resultList;
}

const root = {
  image: getImage,
  images: getImages,
  video: getVideo,
  videos: getVideos
};

module.exports.getGraphqlSchema = () => {
  return schema;
}

module.exports.getGraphqlRoot = () => {
  return root;
}
