const helper = require('../helper.js');
const spinner = require('firost/spinner');
const config = require('../config.js');
const state = require('../state.js');
const dateHelper = require('../helpers/date.js');
const postIdsHelper = require('../helpers/postIds.js');
const postsHelper = require('../helpers/posts.js');
const pMap = require('golgoth/pMap');

/**
 * Update list of records with the most recents one
 * @param {string} subredditName Name of the subreddit to download
 * @param {object} options Options to override the default config
 * @returns {boolean} True on success, false otherwise
 */
module.exports = async (subredditName, options = {}) => {
  await config.init(options);
  const progress = spinner();

  // Start date is by default 7 days before the last crawl. This can be changed
  // with the incrementalWindow config
  const lastCrawlDate = await state.getLastCrawlDate();
  const incrementalWindow = config.incrementalWindow();
  const startDate = dateHelper
    .fromTimestamp(lastCrawlDate)
    .subtract(...incrementalWindow)
    .unix();
  const now = dateHelper.now();

  // Getting all new postIds
  const displayStartDate = dateHelper.display(startDate);
  progress.tick(
    `[${subredditName}] Fetching all postIds since ${displayStartDate}`
  );
  const newPostIds = await postIdsHelper.postIds(subredditName, startDate, now);

  // Getting updated information
  progress.tick(`[${subredditName}] Fetching post details`);
  const newPosts = await postsHelper.fromIds(subredditName, [newPostIds[0]]);
  console.info(newPosts);

  progress.tick(`[${subredditName}] Saving records on disk`);
  await pMap(newPosts, async (newPost) => {
    await helper.saveRecord(newPost);
  });

  progress.success(`[${subredditName}] All recent records updated`);

  await state.updateLastCrawlDate();
};
