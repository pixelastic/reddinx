const current = require('../records.js');
const readJson = require('firost/readJson');
const config = require('../../config.js');
const _ = require('golgoth/lodash');

describe('records', () => {
  beforeEach(async () => {
    await config.init();
  });

  describe('fromPost', () => {
    let fixtureDefault;
    beforeAll(async () => {
      fixtureDefault = await readJson('./fixtures/posts/default.json');
    });
    describe('default fixture', () => {
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
        ['score.ups', 52],
        ['score.downs', 0],
        ['score.ratio', 0.94],
        ['score.value', 52],
        ['score.comments', 5],
      ])('%s', async (key, expected) => {
        const actual = await current.fromPost(fixtureDefault);
        expect(actual).toHaveProperty(key, expected);
      });
    });
    describe('special cases', () => {
      it('no tags', async () => {
        const override = { link_flair_text: null };
        const input = _.merge({}, fixtureDefault, override);
        const actual = await current.fromPost(input);
        expect(actual).toHaveProperty('tags', []);
      });
      it('post deleted', async () => {
        const override = { selftext: '[deleted]' };
        const input = _.merge({}, fixtureDefault, override);
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

      const actual = await current.fromPost(fixtureDefault);
      expect(actual).toHaveProperty('onEachCalled', true);
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
  describe('isDeleted', () => {
    it.each([
      ['[deleted] text', { selftext: '[deleted]' }, true],
      ['is_robot_indexable false', { is_robot_indexable: false }, true],
      ['removed_by_category set', { removed_by_category: 'reddit' }, true],
    ])('%s', async (_name, input, expected) => {
      const actual = current.isDeleted(input);
      expect(actual).toEqual(expected);
    });
  });
});
