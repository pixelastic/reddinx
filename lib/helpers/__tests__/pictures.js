const current = require('../pictures.js');
const readJson = require('firost/readJson');
const config = require('../../config.js');
const imoen = require('imoen');

describe('pictures', () => {
  beforeEach(async () => {
    await config.init();
  });

  describe('getMetadata', () => {
    let fixtureDefault;
    let fixtureGallery;
    beforeAll(async () => {
      fixtureDefault = await readJson('./fixtures/posts/default.json');
      fixtureGallery = await readJson('./fixtures/posts/gallery.json');
    });
    beforeEach(async () => {
      jest.spyOn(current, '__imoen').mockImplementation(async () => {
        return await imoen('./fixtures/pictures/default.jpg');
      });
    });
    describe('default fixture', () => {
      it.each([
        [
          'fullUrl',
          'https://preview.redd.it/3cg1g2iok9e41.jpg?auto=webp&s=e56651d6a1c05f8192d75e032d4df77d5c213466',
        ],
        [
          'url',
          'https://preview.redd.it/3cg1g2iok9e41.jpg?width=640&crop=smart&auto=webp&s=5f81639d4693950bf937ebc498abc19ea7b80352',
        ],
        ['width', 640],
        ['height', 480],
        [
          'lqip',
          'data:image/jpg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAMABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQIG/8QAIhAAAgEEAQQDAAAAAAAAAAAAAQIDAAQREjETISJBI7HB/8QAFQEBAQAAAAAAAAAAAAAAAAAABAX/xAAZEQEAAgMAAAAAAAAAAAAAAAABABECAzH/2gAMAwEAAhEDEQA/AMJZWst9HNuwEKeTsThEP36qh1vjDzRzRht43UHVjjGfykb0Czs4YYxtGkKNhySGLuwJYcHgY7UbLK3RJY7ajYZ4Hb1ip5sXKovhc//Z',
        ],
        ['filesize', 90464],
        ['hash', '1d80f401c2'],
      ])('%s', async (key, expected) => {
        const actual = await current.getMetadata(fixtureDefault);
        expect(actual).toHaveProperty(key, expected);
      });
    });
    describe('gallery fixture', () => {
      it.each([
        [
          'url',
          'https://preview.redd.it/bw7tv29bckx61.png?width=640&crop=smart&auto=webp&s=6bd4ed0327a1197ffbfc8c1f491645866cfbc601',
        ],
        [
          'fullUrl',
          'https://preview.redd.it/bw7tv29bckx61.png?width=886&format=png&auto=webp&s=9ae07faa62017878f63a1e94cd8d1e90e99d6a5e',
        ],
        ['width', 640],
        ['height', 480],
        [
          'lqip',
          'data:image/jpg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAMABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQIG/8QAIhAAAgEEAQQDAAAAAAAAAAAAAQIDAAQREjETISJBI7HB/8QAFQEBAQAAAAAAAAAAAAAAAAAABAX/xAAZEQEAAgMAAAAAAAAAAAAAAAABABECAzH/2gAMAwEAAhEDEQA/AMJZWst9HNuwEKeTsThEP36qh1vjDzRzRht43UHVjjGfykb0Czs4YYxtGkKNhySGLuwJYcHgY7UbLK3RJY7ajYZ4Hb1ip5sXKovhc//Z',
        ],
        ['filesize', 90464],
        ['hash', '1d80f401c2'],
      ])('%s', async (key, expected) => {
        const actual = await current.getMetadata(fixtureGallery);
        expect(actual).toHaveProperty(key, expected);
      });
    });
  });

  describe('default', () => {
    it('fullUrl is the source', async () => {
      const input = {
        preview: {
          images: [
            {
              source: {
                url: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
              },
            },
          ],
        },
      };

      const actual = current.fullUrl(input);
      expect(actual).toEqual('http://there.com/image.jpg?a=1&b=2&c=3');
    });
    it('url is the one with the closest width', async () => {
      const minWidth = 600;
      const input = {
        preview: {
          images: [
            {
              source: {
                url: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
              },
              resolutions: [
                {
                  url: 'nope',
                  width: 215,
                },
                {
                  url: 'yep',
                  width: 640,
                },
                {
                  url: 'nope',
                  width: 960,
                },
              ],
            },
          ],
        },
      };

      const actual = current.url(input, minWidth);
      expect(actual).toEqual('yep');
    });
  });
  describe('gallery', () => {
    it('fullUrl is the url of the first element in the gallery', async () => {
      const input = {
        gallery_data: {
          items: [
            {
              media_id: 'firstMediaId',
            },
          ],
        },
        media_metadata: {
          firstMediaId: {
            s: {
              u: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
            },
            status: 'valid',
          },
        },
      };

      const actual = current.fullUrl(input);
      expect(actual).toEqual('http://there.com/image.jpg?a=1&b=2&c=3');
    });
    it('url is the one with the closest width', async () => {
      const minWidth = 600;
      const input = {
        gallery_data: {
          items: [
            {
              media_id: 'firstMediaId',
            },
          ],
        },
        media_metadata: {
          firstMediaId: {
            p: [
              {
                u: 'nope',
                x: 108,
                y: 92,
              },
              {
                u: 'nope',
                x: 216,
                y: 184,
              },
              {
                u: 'nope',
                x: 320,
                y: 273,
              },
              {
                u: 'yep',
                x: 640,
                y: 546,
              },
            ],
            s: {
              u: 'nope',
              x: 886,
              y: 757,
            },
            status: 'valid',
          },
        },
      };

      const actual = current.url(input, minWidth);
      expect(actual).toEqual('yep');
    });
    it('ignore upload failed pictures', async () => {
      const input = {
        gallery_data: {
          items: [
            {
              media_id: 'firstMediaId',
            },
            {
              media_id: 'secondMediaId',
            },
          ],
        },
        media_metadata: {
          firstMediaId: { status: 'failed' },
          secondMediaId: {
            s: {
              u: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
            },
            status: 'valid',
          },
        },
      };

      const actual = current.fullUrl(input);
      expect(actual).toEqual('http://there.com/image.jpg?a=1&b=2&c=3');
    });
    it('returns false if all picture failed', async () => {
      const input = {
        gallery_data: {
          items: [
            {
              media_id: 'firstMediaId',
            },
            {
              media_id: 'secondMediaId',
            },
          ],
        },
        media_metadata: {
          firstMediaId: { status: 'failed' },
          secondMediaId: {
            status: 'failed',
          },
        },
      };

      const actual = current.fullUrl(input);
      expect(actual).toEqual(false);
    });
  });

  describe('isGalleryPost', () => {
    it.each([
      ['no gallery_data', {}, false],
      ['empty gallery_data', { gallery_data: null }, false],
      ['existing gallery_data', { gallery_data: {} }, false],
    ])('%s', async (_name, input, expected) => {
      const actual = current.isGalleryPost(input);
      expect(actual).toEqual(expected);
    });
  });
});
