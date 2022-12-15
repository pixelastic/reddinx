const _ = require('golgoth/lodash');
const readJsonUrl = require('./readJsonUrl.js');
const buildUrl = require('./buildUrl.js');
const dateHelper = require('./date.js');

module.exports = {
  /**
   * Returns the post ids from a given month
   * @param {string} subreddit Name of the subreddit
   * @param {number} year Year to check
   * @param {number} month Month to check
   * @returns {Array} List of ids
   **/
  async fromMonth(subreddit, year, month) {
    const startOfMonth = dateHelper.month(year, month);
    const endOfMonth = startOfMonth.endOf('month');
    return await this.postIds(
      subreddit,
      startOfMonth.unix(),
      endOfMonth.unix()
    );
  },
  async postIds(subredditName, startDate, endDate) {
    const posts = await this.posts(subredditName, startDate, endDate);
    return _.map(posts, 'id');
  },
  /**
   * Returns all posts on a specific subreddit between two dates.
   * Takes care of recursively calling the API until the full list is obtained
   * @param {string} subreddit Name of the subreddit
   * @param {number} startDate Start date, as a unix timestamp
   * @param {number} endDate End date, as a unix timestamp
   * @returns {Array} List of posts
   **/
  async posts(subreddit, startDate, endDate) {
    const posts = await this.rawPosts(subreddit, startDate, endDate);
    // Stop recursion if no posts found
    if (_.isEmpty(posts)) {
      return [];
    }

    // Check for posts after the last one
    const lastPostDate = _.chain(posts).last().get('created_utc').value();
    const nextPosts = await this.posts(subreddit, lastPostDate, endDate);
    return _.concat(posts, nextPosts);
  },
  /**
   * Calls pushshift API to get the list of all posts on a specific subreddit
   * between two dates.
   * Uses a cache on disk to limit queries.
   * Note that the API can only return 100 items at a time
   * @param {string} subreddit Name of the subreddit
   * @param {number} startDate Start date, as a unix timestamp
   * @param {number} endDate End date, as a unix timestamp
   * @returns {Array} List of posts
   **/
  async rawPosts(subreddit, startDate, endDate) {
    const baseUrl = 'https://api.pushshift.io/reddit/search/submission/';
    const options = {
      subreddit,
      order: 'asc',
      sort: 'created_utc',
      after: startDate,
      before: endDate,
      size: 1000,
    };

    const url = buildUrl(baseUrl, options);

    const response = await readJsonUrl(url);
    return response.data;
  },
};
