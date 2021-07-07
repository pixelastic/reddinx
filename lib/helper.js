const _ = require('golgoth/lodash');
const pMap = require('golgoth/pMap');
const readJsonUrl = require('./readJsonUrl.js');
const config = require('./config.js');
const postIdsHelper = require('./helpers/postIds.js');
const postsHelper = require('./helpers/posts.js');
const recordsHelper = require('./helpers/records.js');
const dateHelper = require('./helpers/date.js');
const path = require('path');
const { writeJson, remove } = require('firost');

module.exports = {
  /**
   * Returns the UTC creation date of a given subreddit
   * @param {string} subredditName Name of the subreddit
   * @returns {number} Creating date as unix timestamp
   **/
  async creationDate(subredditName) {
    const url = `https://www.reddit.com/r/${subredditName}/about.json`;
    const data = await readJsonUrl(url);
    return _.get(data, 'data.created_utc');
  },
  /**
   * Calls the callback for each month since the subreddit creation
   * @param {string} subredditName Name of the subreddit
   * @param {Function} callback Asynchronous callback to call with the year and
   * month
   **/
  async forEachMonth(subredditName, callback) {
    const creationDate = await this.creationDate(subredditName);

    const startOfCreationMonth = dateHelper.startOf(creationDate, 'month');
    const endOfCurrentMonth = dateHelper.dayjs.utc().endOf('month');

    // Build the list of year/months
    let current = startOfCreationMonth;
    const items = [];
    while (dateHelper.isSameOrBefore(current, endOfCurrentMonth)) {
      const year = current.year();
      const month = current.month();
      items.push({ year, month });
      current = current.add(1, 'month');
    }

    // Call callback on each
    await pMap(
      items,
      async ({ year, month }) => {
        await callback(year, month);
      },
      { concurrency: 1 }
    );
  },
  /**
   * Returns all monthly posts for a given subreddit
   * @param {string} subredditName Name of the subreddit
   * @param {number} year Year to check
   * @param {number} month Month to check
   * @returns {Array} List of all posts
   **/
  async getPosts(subredditName, year, month) {
    const postIds = await postIdsHelper.fromMonth(subredditName, year, month);
    return postsHelper.fromIds(subredditName, postIds);
  },
  /**
   * Save all monthly posts of a given subreddit as record on disk
   * @param {string} subredditName Name of the subreddit
   * @param {number} year Year to save
   * @param {number} month Month to save
   **/
  async saveRecords(subredditName, year, month) {
    const posts = await this.getPosts(subredditName, year, month);
    await pMap(
      posts,
      async (post) => {
        await this.saveRecord(post);
      },
      { concurrency: 100 }
    );
  },
  /**
   * Save one post as a record on disk
   * @param {object} post Post object
   **/
  async saveRecord(post) {
    const recordData = recordsHelper.fromPost(post);
    const recordPath = this.recordPath(post);

    // Update or delete existing record
    recordData
      ? await writeJson(recordData, recordPath)
      : await remove(recordPath);
  },
  /**
   * Returns the path to save the record on disk
   * @param {object} post Raw post to convert to a record
   * @returns {string} Path to save the file
   **/
  recordPath(post) {
    const id = `t3_${post.id}`;
    const date = _.get(post, 'created_utc');
    const datePath = dateHelper.path(date);
    const subredditName = _.get(post, 'subreddit');
    return path.resolve(
      config.dataPath(),
      subredditName,
      datePath,
      `${id}.json`
    );
  },
};
