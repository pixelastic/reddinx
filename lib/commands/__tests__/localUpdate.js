const current = require('../localUpdate.js');
const config = require('../../config.js');
const { sleep, exist, writeJson, readJson } = require('firost');
const path = require('path');

describe('localUpdate', () => {
  const tmpDirectory = './tmp/commands/localUpdate';
  const dataDirectory = path.resolve(tmpDirectory, 'data');
  const subredditName = 'dndmaps';
  const recordPath = path.resolve(
    dataDirectory,
    subredditName,
    '2020/01/uuid.json'
  );
  beforeEach(async () => {
    jest.spyOn(config, 'dataPath').mockReturnValue(dataDirectory);
    jest.spyOn(current, '__spinner').mockImplementation(() => {
      return {
        tick: () => {},
        success: () => {},
      };
    });
  });
  it('should update existing files', async () => {
    jest.spyOn(config, 'onEach').mockReturnValue((record) => {
      record.name = 'tom';
      return record;
    });
    await writeJson({ name: 'tim' }, recordPath);

    await current(subredditName);

    const actual = await readJson(recordPath);
    expect(actual).toHaveProperty('name', 'tom');
  });
  it('should delete files no longer relevant', async () => {
    jest.spyOn(config, 'onEach').mockReturnValue(() => {
      return false;
    });
    await writeJson({ name: 'tim' }, recordPath);

    await current(subredditName);

    const actual = await exist(recordPath);
    expect(actual).toEqual(false);
  });
  it('should handle asynchronous calls', async () => {
    jest.spyOn(config, 'onEach').mockReturnValue(async (record) => {
      await sleep(10);
      record.name = 'tom';
      return record;
    });
    await writeJson({ name: 'tim' }, recordPath);

    await current(subredditName);

    const actual = await readJson(recordPath);
    expect(actual).toHaveProperty('name', 'tom');
  });
});
