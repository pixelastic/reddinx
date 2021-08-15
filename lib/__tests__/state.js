const current = require('../state.js');
const { readJson, emptyDir } = require('firost');
const path = require('path');

describe('state', () => {
  const tmpDirectory = './tmp/state';
  const reddinxStatePath = path.resolve(tmpDirectory, 'reddinx.state.json');
  beforeEach(async () => {
    await emptyDir(tmpDirectory);
    jest.spyOn(current, '__getStatePath').mockReturnValue(reddinxStatePath);
  });
  it('should have no value by default', async () => {
    const actual = await current.getLastCrawlDate('dndmaps');
    expect(actual).toEqual(undefined);
  });
  it('should allow updating the value with current time', async () => {
    await current.updateLastCrawlDate('dndmaps');
    const actual = await current.getLastCrawlDate('dndmaps');

    const stateContent = await readJson(reddinxStatePath);
    expect(actual).toEqual(stateContent.dndmaps.lastCrawlDate);
  });
  it('should save different crawl dates per subreddit', async () => {
    await current.updateLastCrawlDate('dndmaps');
    await current.updateLastCrawlDate('terrainbuilding');

    const lastCrawlDateOne = await current.getLastCrawlDate('dndmaps');
    const lastCrawlDateTwo = await current.getLastCrawlDate('terrainbuilding');

    const stateContent = await readJson(reddinxStatePath);
    expect(stateContent).toHaveProperty(
      'dndmaps.lastCrawlDate',
      lastCrawlDateOne
    );
    expect(stateContent).toHaveProperty(
      'terrainbuilding.lastCrawlDate',
      lastCrawlDateTwo
    );
  });
  it('should allow updating the value with current time', async () => {
    await current.updateLastCrawlDate('DNDmaps');
    const actual = await current.getLastCrawlDate('dndmaps');

    const stateContent = await readJson(reddinxStatePath);
    expect(actual).toEqual(stateContent.dndmaps.lastCrawlDate);
  });
});
