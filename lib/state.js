const { readJson, writeJson, packageRoot, exist } = require('firost');
const path = require('path');
const dateHelper = require('./helpers/date.js');
const _ = require('golgoth/lodash');

module.exports = {
  /**
   * Returns the date of last crawl
   * @param {string} subredditName Name of the subreddit
   * @returns {number} Date of last crawl as a unix timestamp
   **/
  async getLastCrawlDate(subredditName) {
    const state = await this.getState();
    return _.get(state, this.path(subredditName));
  },
  /**
   * Update the date of the last crawl to now
   * @param {string} subredditName Name of the subreddit
   **/
  async updateLastCrawlDate(subredditName) {
    const state = await this.getState();
    _.set(state, this.path(subredditName), dateHelper.now());

    const statePath = await this.__getStatePath();
    await writeJson(state, statePath);
  },
  /**
   * Returns the full state
   * @returns {object} Current state
   **/
  async getState() {
    const statePath = await this.__getStatePath();
    if (!(await exist(statePath))) {
      return {};
    }
    return await readJson(statePath);
  },
  /**
   * Returns the JSON path to the lastCrawlDate for a given subreddit
   * @param {string} subredditName Name of the subreddit
   * @returns {string} Path to the value
   **/
  path(subredditName) {
    const name = subredditName.toLowerCase();
    return `${name}.lastCrawlDate`;
  },
  // Getting the path to the reddinx.state.json
  async __getStatePath() {
    const root = await this.__packageRoot(process.cwd());
    return path.resolve(root, 'reddinx.state.json');
  },

  __packageRoot: packageRoot,
};
