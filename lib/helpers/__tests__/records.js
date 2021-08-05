const current = require('../records.js');
const readJson = require('firost/readJson');
const config = require('../../config.js');
const _ = require('golgoth/lodash');
const imoen = require('imoen');

describe('records', () => {
  beforeEach(async () => {
    await config.init();
  });

  describe('fromPost', () => {
    let fixture;
    beforeAll(async () => {
      fixture = await readJson('./fixtures/posts/default.json');
    });
    beforeEach(async () => {
      jest.spyOn(current, '__imoen').mockImplementation(async () => {
        return await imoen('./fixtures/pictures/default.jpg');
      });
    });
    it.each([
      ['id', 't3_ex2lw7'],
      [
        'title',
        'Mining city up against the mountains I created for my campaign.',
      ],
      [
        'url',
        'https://www.reddit.com/r/dndmaps/comments/ex2lw7/mining_city_up_against_the_mountains_i_created/',
      ],
      ['date.full', 1580542033],
      ['date.day', 1580515200],
      ['date.week', 1579996800],
      ['date.month', 1580515200],
      ['tags', ['City Map']],
      ['subreddit.name', 'DNDMaps'],
      ['subreddit.id', 't5_3isai'],
      ['author.name', 'Jurtrazi'],
      ['author.id', 't2_2anmms39'],
      [
        'picture.thumbnailUrl',
        'https://b.thumbs.redditmedia.com/FzWUmMZks1lPmna15lj3djwK_60T4AqgUCm7FuvbSNk.jpg',
      ],
      [
        'picture.fullUrl',
        'https://preview.redd.it/3cg1g2iok9e41.jpg?auto=webp&s=e56651d6a1c05f8192d75e032d4df77d5c213466',
      ],
      [
        'picture.url',
        'https://preview.redd.it/3cg1g2iok9e41.jpg?width=640&crop=smart&auto=webp&s=5f81639d4693950bf937ebc498abc19ea7b80352',
      ],
      ['picture.width', 640],
      ['picture.height', 480],
      [
        'picture.lqip',
        'data:image/jpg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAMABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQIG/8QAIhAAAgEEAQQDAAAAAAAAAAAAAQIDAAQREjETISJBI7HB/8QAFQEBAQAAAAAAAAAAAAAAAAAABAX/xAAZEQEAAgMAAAAAAAAAAAAAAAABABECAzH/2gAMAwEAAhEDEQA/AMJZWst9HNuwEKeTsThEP36qh1vjDzRzRht43UHVjjGfykb0Czs4YYxtGkKNhySGLuwJYcHgY7UbLK3RJY7ajYZ4Hb1ip5sXKovhc//Z',
      ],
      ['picture.filesize', 90464],
      ['picture.hash', '1d80f401c2'],
      ['score.ups', 52],
      ['score.downs', 0],
      ['score.ratio', 0.94],
      ['score.value', 52],
      ['score.comments', 5],
    ])('%s', async (key, expected) => {
      const actual = await current.fromPost(fixture);
      expect(actual).toHaveProperty(key, expected);
    });
    describe('special cases', () => {
      it('no tags', async () => {
        const override = { link_flair_text: null };
        const input = _.merge({}, fixture, override);
        const actual = await current.fromPost(input);
        expect(actual).toHaveProperty('tags', []);
      });
      it('post deleted', async () => {
        const override = { selftext: '[deleted]' };
        const input = _.merge({}, fixture, override);
        const actual = await current.fromPost(input);
        expect(actual).toEqual(null);
      });
    });
    it('should apply the onEach hook', async () => {
      await config.init({
        onEach(record) {
          record.onEachCalled = true;
          return record;
        },
      });

      const actual = await current.fromPost(fixture);
      expect(actual).toHaveProperty('onEachCalled', true);
    });
  });
  describe('pictureFullUrl', () => {
    it('should return the source', async () => {
      const input = {
        images: [
          {
            source: {
              url: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
            },
          },
        ],
      };

      const actual = current.pictureFullUrl(input);
      expect(actual).toEqual('http://there.com/image.jpg?a=1&b=2&c=3');
    });
  });
  describe('pictureUrl', () => {
    it('should return the resolution with the width closest but above the upperBound', async () => {
      const minWidth = 600;
      const input = {
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
      };

      const actual = current.pictureUrl(input, minWidth);
      expect(actual).toEqual('yep');
    });
  });
  describe('title', () => {
    it.each([
      ['[OC] Dungeon pit trap', 'Dungeon pit trap'],
      ['Northern Land of Giants [Part 01] [27x17]', 'Northern Land of Giants'],
      [
        '[OC] District Maps for the City of Fairglass (First Homebrew City!) [X-Post from r/DnD]',
        'District Maps for the City of Fairglass (First Homebrew City!)',
      ],
      [
        '[OC] abandoned mansion | first map ever - criticism &amp; advice?',
        'Abandoned mansion | first map ever - criticism & advice?',
      ],
    ])('%s', async (input, expected) => {
      const data = {
        title: input,
      };
      const actual = current.title(data);
      expect(actual).toEqual(expected);
    });
  });
  describe('tags', () => {
    it('from flair', async () => {
      const input = {
        link_flair_text: 'City Map',
      };
      const actual = current.tags(input);
      expect(actual).toEqual(['City Map']);
    });
  });
});
