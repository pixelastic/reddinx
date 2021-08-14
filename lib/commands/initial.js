const helper = require('../helper.js');
const spinner = require('firost/spinner');
const config = require('../config.js');
const state = require('../state.js');
const dateHelper = require('../helpers/date.js');

/**
 * Download all posts as records on disk
 * @param {string} subredditName Name of the subreddit to download
 * @param {object} options Options to override the default config
 * @returns {boolean} True on success, false otherwise
 */
module.exports = async (subredditName, options = {}) => {
  await config.init(options);

  const progress = spinner();
  await helper.forEachMonth(subredditName, async (year, month) => {
    const displayDate = dateHelper.month(year, month).format('MMMM YYYY');
    progress.tick(`[${subredditName}] ${displayDate}`);
    await helper.saveRecords(subredditName, year, month);
  });
  progress.success(`[${subredditName}] All records downloaded`);

  await state.updateLastCrawlDate();
};
