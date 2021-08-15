const { _ } = require('golgoth');
const readJsonUrl = require('firost/readJsonUrl');

module.exports = {
  /**
   * Returns the first comment of a given post
   * @param {object} post Raw post data
   * @returns {object} Raw comment data
   **/
  async getFirstComment(post) {
    const subredditName = _.get(post, 'subreddit');
    const postId = _.get(post, 'id');
    const authorName = _.get(post, 'author');

    const url = `https://www.reddit.com/r/${subredditName}/comments/${postId}.json`;
    const response = await readJsonUrl(url);

    return _.chain(response)
      .flatten()
      .map('data.children')
      .flatten()
      .find({ kind: 't1', data: { author: authorName } })
      .get('data')
      .value();
  },
};
