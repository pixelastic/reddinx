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
  it('should allow getting and updating the value', async () => {
    // No initial value
    const initialValue = await current.getLastCrawlDate();
    expect(initialValue).toEqual(undefined);

    // Update the value, we can read it and it updates the file
    await current.updateLastCrawlDate();
    const stateContent = await readJson(reddinxStatePath);
    const secondValue = await current.getLastCrawlDate();
    expect(stateContent).toHaveProperty('lastCrawlDate', secondValue);
  });
});
