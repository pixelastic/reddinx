const current = require('../../helper.js');
const config = require('../../config.js');
const recordsHelper = require('../records.js');
const { newFile, readJson, emptyDir, exist } = require('firost');
const path = require('path');

describe('helper', () => {
  const tmpDirectory = './tmp/helpers/helper';
  const dataDirectory = path.resolve(tmpDirectory, 'data');
  let fixture;
  beforeEach(async () => {
    await emptyDir(tmpDirectory);
    await config.init();
  });
  beforeAll(async () => {
    fixture = await readJson('./fixtures/posts/default.json');
  });
  describe('recordPath', () => {
    beforeEach(async () => {
      await config.init({
        dataPath: dataDirectory,
      });
    });
    it('should return the complete filepath', () => {
      const actual = current.recordPath(fixture);
      expect(actual).toEqual(`${dataDirectory}/dndmaps/2020/02/t3_ex2lw7.json`);
    });
  });
  describe('saveRecord', () => {
    const record = { name: 'my post' };
    const recordPath = path.resolve(tmpDirectory, 'record.json');
    beforeEach(async () => {
      jest.spyOn(current, 'recordPath').mockReturnValue(recordPath);
    });

    it('saves the post to disk', async () => {
      jest.spyOn(recordsHelper, 'fromPost').mockReturnValue(record);

      await current.saveRecord('any_post_id');
      const actual = await readJson(recordPath);
      expect(actual).toEqual(record);
    });
    it('do not save if no record to save', async () => {
      jest.spyOn(recordsHelper, 'fromPost').mockReturnValue(null);

      await current.saveRecord('any_post_id');
      const actual = await exist(recordPath);
      expect(actual).toEqual(false);
    });
    it('deletes existing record if no record to save', async () => {
      await newFile(recordPath);
      jest.spyOn(recordsHelper, 'fromPost').mockReturnValue(null);

      await current.saveRecord('any_post_id');
      const actual = await exist(recordPath);
      expect(actual).toEqual(false);
    });
  });
});
