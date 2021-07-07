const { packageRoot, exist, require: firostRequire } = require('firost');
const path = require('path');

module.exports = {
  /**
   * Init the config by reading reddinx.config.js
   * @param {object} userConfig Additional config to overwrite the defaults
   **/
  async init(userConfig) {
    const fileConfig = await this.getFileConfig();
    this.__config = {
      cachePath: './.cache',
      dataPath: './data',
      onEach(record) {
        return record;
      },
      incrementalWindow: [7, 'days'],
      ...fileConfig,
      ...userConfig,
    };
  },
  /**
   * Return the content of the reddinx.config.js file
   * @returns {object} Config object
   **/
  async getFileConfig() {
    const configPath = path.resolve(
      await this.__packageRoot(),
      'reddinx.config.js'
    );
    if (!(await exist(configPath))) {
      return {};
    }
    return firostRequire(configPath, { forceReload: true });
  },
  cachePath() {
    return this.__config.cachePath;
  },
  dataPath() {
    return this.__config.dataPath;
  },
  onEach() {
    return this.__config.onEach;
  },
  incrementalWindow() {
    return this.__config.incrementalWindow;
  },
  getAll() {
    return this.__config;
  },
  __packageRoot: packageRoot,
};
