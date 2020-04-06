const { buildSchema } = require('graphql');
const imageSearch = require('../controller/imageSearch');

const schema = buildSchema(`
  type Query {
    image(imageId: String, searchTerm: String): Image
    images(searchTerm: String): [Image]
  },
  type Image {
    image_id: String
    thumbnails: String
    preview: String
    title: String
    source: String
    tags: [String]
  }
`);

const getImagesList = async (searchTerm) => {
  const imagesList = await imageSearch.getImageSearchForTest(searchTerm);
  return imagesList;
};

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
    if (filterResult && filterResult.length === 1) result = filterResult[0];
  }
  return result;
};

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
};

const root = {
  image: getImage,
  images: getImages,
};

module.exports.getGraphqlSchema = () => {
  return schema;
};

module.exports.getGraphqlRoot = () => {
  return root;
};
