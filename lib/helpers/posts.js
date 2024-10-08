const _ = require('golgoth/lodash');
const pMap = require('golgoth/pMap');
const exist = require('firost/exist');
const readJson = require('firost/readJson');
const readJsonUrl = require('firost/readJsonUrl');
const writeJson = require('firost/writeJson');
const objectHash = require('node-object-hash')().hash;
const path = require('path');
const config = require('../config.js');
const buildUrl = require('./buildUrl.js');
const commentsHelper = require('./comments.js');

module.exports = {
  /**
   * Returns a list of posts from their ids
   * @param {string} subredditName Name of the subreddit
   * @param {Array} postIds List of post ids
   * @returns {Array} List of posts
   **/
  async fromIds(subredditName, postIds) {
    const baseUrl = `https://www.reddit.com/r/${subredditName}/api/info.json`;
    // API can only fetch posts 100 at a time
    const chunks = _.chunk(postIds, 100);

    const aggregatedChunks = await pMap(chunks, async (chunk) => {
      const options = {
        id: this.fullnamify(chunk),
      };

      const url = buildUrl(baseUrl, options);

      // Return value from disk cache if available
      // We cannot use the default cache from readJsonUrl because the filepath
      // will be too long
      const hashPath = objectHash(options);
      const cachePath = path.resolve(
        config.cachePath(),
        'posts',
        `${hashPath}.json`
      );
      if (await exist(cachePath)) {
        return await readJson(cachePath);
      }

      const response = await readJsonUrl(url);

      const postData = _.chain(response)
        .get('data.children', [])
        .map('data')
        .value();
      await writeJson(postData, cachePath);
      return postData;
    });

    const allPosts = _.flatten(aggregatedChunks);

    // We also grab the related comments, so we can extract the post description
    await pMap(allPosts, async (post) => {
      post.__description = await this.getDescription(post);
    });

    return allPosts;
  },
  /**
   * Returns the description of a given post
   * @param {object} post Raw post data
   * @returns {string} Post description
   **/
  async getDescription(post) {
    const firstComment = await commentsHelper.getFirstComment(post);
    return _.get(firstComment, 'body', '');
  },

  /**
   * Replaces all post partial ids from their fullnames
   * @param {Array} postIds List of post ids
   * @returns {Array} List of post fullnames
   **/
  fullnamify(postIds) {
    return _.chain(postIds)
      .map((postId) => `t3_${postId}`)
      .join(',')
      .value();
  },
};
