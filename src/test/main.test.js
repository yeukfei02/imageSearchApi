const imageSearch = require('./imageSearch');
const videoSearch = require('./videoSearch');

describe('main.test', () => {
  describe('imageSearch', () => {
    test('getImageSearch', async () => {
      try {
        const result = await imageSearch.getImageSearch('Hong Kong');
        expect(result).toBeDefined();

        if (result) {
          result.forEach((listItem, i) => {
            if (listItem) {
              listItem.forEach((item, i) => {
                if (item) {
                  expect(item.image_id).toBeDefined();
                  expect(item.thumbnails).toBeDefined();
                  expect(item.preview).toBeDefined();
                  expect(item.title).toBeDefined();
                  expect(item.source).toBeDefined();
                  expect(item.tags).toBeDefined();

                  expect(item.source === 'Unsplash' || item.source === 'Pixabay').toBeTruthy();
                }
              });
            }
          });
        }
      } catch (e) {
        console.log(`error = ${e.message}`);
      }
    });
  });

  describe('videoSearch', () => {
    test('getVideoSearch', async () => {
      try {
        const result = await videoSearch.getVideoSearch('Dog');
        expect(result).toBeDefined();

        if (result) {
          result.forEach((item, i) => {
            if (item) {
              expect(item.video_id).toBeDefined();
              expect(item.type).toBeDefined();
              expect(item.videos).toBeDefined();
              expect(item.source).toBeDefined();
              expect(item.tags).toBeDefined();
              expect(item.views).toBeDefined();
              expect(item.downloads).toBeDefined();

              expect(item.source === 'Pixabay').toBeTruthy();
            }
          });
        }
      } catch (e) {
        console.log(`error = ${e.message}`);
      }
    });
  });
});
