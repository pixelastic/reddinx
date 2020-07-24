const helper = require('../helper.js');
const spinner = require('firost/lib/spinner');
const config = require('../config.js');
const dateHelper = require('../helpers/date.js');
const reddinxConfig = require('../helpers/reddinxConfig.js');
const postIdsHelper = require('../helpers/postIds.js');
const postsHelper = require('../helpers/posts.js');
const pMap = require('golgoth/lib/pMap');

/**
 * Update list of records with the most recents one
 * @param {string} subredditName Name of the subreddit to download
 * @param {object} options Options to override the default config
 * @returns {boolean} True on success, false otherwise
 */
module.exports = async (subredditName, options = {}) => {
  config.setAll(options);
  const progress = spinner();

  const lastCrawlDate = await reddinxConfig.read('lastCrawlDate');
  const now = dateHelper.now();

  // Getting all new postIds
  const displayLastCrawl = dateHelper.display(lastCrawlDate);
  progress.tick(`Fetching all postIds since ${displayLastCrawl}`);
  const newPostIds = await postIdsHelper.postIds(
    subredditName,
    lastCrawlDate,
    now
  );

  // Getting updated infromation
  progress.tick('Fetching post details');
  const newPosts = await postsHelper.fromIds(subredditName, newPostIds);

  progress.tick('Saving records on disk');
  await pMap(newPosts, async (newPost) => {
    await helper.saveRecord(newPost);
  });

  progress.success('All recent records updated');

  await reddinxConfig.updateLastCrawlDate();
};
