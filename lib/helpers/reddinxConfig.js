const path = require('path');
const exist = require('firost/lib/exist');
const readJson = require('firost/lib/readJson');
const writeJson = require('firost/lib/writeJson');
const _ = require('golgoth/lib/lodash');
const dateHelper = require('./date.js');

module.exports = {
  /**
   * Returns the path to the reddinx.config.js file
   * @returns {string} Path to the config
   **/
  filepath() {
    return path.resolve(process.cwd(), 'reddinx.config.json');
  },
  /**
   * Wrapper to return the full config or an empty object if the file does not
   * exist
   * @returns {object} Config object
   **/
  async __readConfig() {
    const filepath = this.filepath();
    return (await exist(filepath)) ? await readJson(filepath) : {};
  },
  /**
   * Read a config key from the config, or return the whole config if no key
   * passed
   * @param {string} key Optional key to read
   * @returns {*} Value of the key or whole object
   **/
  async read(key) {
    const config = await this.__readConfig();
    if (!key) {
      return config;
    }
    return _.get(config, key);
  },
  /**
   * Write the specific key value on disk
   * @param {string} key Key name
   * @param {*} value Value of the key
   * @returns {*} Value of the key or full object
   **/
  async write(key, value) {
    const filepath = this.filepath();
    const config = await this.__readConfig();
    _.set(config, key, value);
    await writeJson(config, filepath);
  },
  /**
   * Update the last crawl date in the config file
   **/
  async updateLastCrawlDate() {
    const now = dateHelper.now();
    await this.write('lastCrawlDate', now);
  },
};
