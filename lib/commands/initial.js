const helper = require('../helper.js');
const reddinxConfig = require('../helpers/reddinxConfig.js');
const spinner = require('firost/lib/spinner');
const dayjs = require('golgoth/lib/dayjs');
const config = require('../config.js');

/**
 * Download all posts as records on disk
 * @param {string} subredditName Name of the subreddit to download
 * @param {object} options Options to override the default config
 * @returns {boolean} True on success, false otherwise
 */
module.exports = async (subredditName, options = {}) => {
  config.setAll(options);
  const progress = spinner();
  await helper.forEachMonth(subredditName, async (year, month) => {
    const displayDate = dayjs()
      .year(year)
      .month(month - 1)
      .format('MMMM YYYY');
    progress.tick(displayDate);
    await helper.saveRecords(subredditName, year, month);
  });
  progress.success('All records downloaded');

  await reddinxConfig.updateLastCrawlDate();
};
