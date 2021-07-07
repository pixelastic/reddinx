const { readJson, writeJson, packageRoot, exist } = require('firost');
const path = require('path');
const dateHelper = require('./helpers/date.js');

module.exports = {
  /**
   * Returns the date of last crawl
   * @returns {number} Date of last crawl as a unix timestamp
   **/
  async getLastCrawlDate() {
    const state = await this.getState();
    return state.lastCrawlDate;
  },
  /**
   * Update the date of the last crawl to now
   **/
  async updateLastCrawlDate() {
    const state = await this.getState();
    state.lastCrawlDate = dateHelper.now();

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
  // Getting the path to the reddinx.state.json
  async __getStatePath() {
    const root = await this.__packageRoot();
    return path.resolve(root, 'reddinx.state.json');
  },
  __packageRoot: packageRoot,
};
