const imageSearch = require('./imageSearch');

describe('main.test', () => {
  describe('imageSearch', () => {
    test('getImageSearch', async () => {
      const result = await imageSearch.getImageSearch('Hong Kong');
      expect(result).toBeDefined();

      if (result) {
        result.forEach((item, i) => {
          expect(item.image_id).toBeDefined();
          expect(item.thumbnails).toBeDefined();
          expect(item.preview).toBeDefined();
          expect(item.title).toBeDefined();
          expect(item.source).toBeDefined();
          expect(item.tags).toBeDefined();

          expect(item.source === 'Unsplash' || item.source === 'Pixabay').toBeTruthy();
        });
      }
    });
  });
});
