const current = require('../config.js');
const { write, emptyDir } = require('firost');
const path = require('path');

describe('config', () => {
  const tmpDirectory = './tmp/config';
  const reddinxConfigPath = path.resolve(tmpDirectory, 'reddinx.config.js');
  beforeEach(async () => {
    await emptyDir(tmpDirectory);
    jest.spyOn(current, '__packageRoot').mockReturnValue(tmpDirectory);
  });
  describe('init', () => {
    it('should set the default values if no reddinx.config.js', async () => {
      await current.init();

      const actual = current.getAll();

      expect(actual).toHaveProperty('dataPath');
      expect(actual).toHaveProperty('cachePath');
      expect(actual).toHaveProperty('onEach');
      expect(actual).toHaveProperty('incrementalWindow');
    });
    it('should overwrite defaults with what is in reddinx.config.js', async () => {
      const reddinxConfigContent = dedent`
      module.exports = {
        dataPath: './my-data',
        onEach(record) {
          return 42
        }
      }`;

      await write(reddinxConfigContent, reddinxConfigPath);

      await current.init();

      const actual = current.getAll();

      expect(actual).toHaveProperty('dataPath', './my-data');
      expect(actual.onEach()).toEqual(42);
    });
  });
});
