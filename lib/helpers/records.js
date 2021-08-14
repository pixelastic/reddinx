const _ = require('golgoth/lodash');
const he = require('he');
const config = require('../config.js');
const dateHelper = require('./date.js');
const pictureHelper = require('./pictures.js');

module.exports = {
  /**
   * Converts a post into a record
   * @param {object} post Reddit post
   * @returns {object} Record for Algolia
   */
  async fromPost(post) {
    if (this.isDeleted(post)) {
      return null;
    }

    const id = `t3_${post.id}`;
    const url = `https://www.reddit.com${post.permalink}`;
    const subredditName = _.get(post, 'subreddit');
    const subredditId = _.get(post, 'subreddit_id');
    const authorName = _.get(post, 'author');
    const authorId = _.get(post, 'author_fullname');

    const title = this.title(post);
    const flair = this.flair(post);
    const tags = this.tags(post);
    const date = this.date(post);

    const picture = await pictureHelper.getMetadata(post);
    if (!picture) {
      return null;
    }

    const score = this.score(post);

    const record = {
      id,
      title,
      url,
      tags,
      flair,
      date,
      subreddit: {
        name: subredditName,
        id: subredditId,
      },
      author: {
        name: authorName,
        id: authorId,
      },
      picture,
      score,
    };

    const userOnEach = await config.onEach();
    return userOnEach(record);
  },
  /**
   * Check if a given post is deleted
   * See https://www.reddit.com/r/redditdev/comments/7hfnew/there_is_currently_no_efficient_way_to_tell_if_a/
   * for various ways of telling if a post is deleted
   * @param {object} data Post data
   * @returns {boolean} True if post is deleted
   **/
  isDeleted(data) {
    const hasDeletedText = data.selftext === '[deleted]';
    const isNotRobotIndexable = data.is_robot_indexable === false;
    const hasRemovedByCategory =
      data.removed_by_category && !_.isEmpty(data.removed_by_category);
    return hasDeletedText || isNotRobotIndexable || hasRemovedByCategory;
  },
  /**
   * Returns a clean title
   * People usually add [tags] in their title. We remove them
   * @param {object} data Post data
   * @returns {string} Post title
   **/
  title(data) {
    return _.chain(data)
      .get('title')
      .replace(/\[.*?\]/g, '')
      .trim()
      .upperFirst()
      .thru(he.decode)
      .value();
  },
  date(data) {
    const full = _.get(data, 'created_utc');
    const day = dateHelper.startOf(full, 'day').unix();
    const week = dateHelper.startOf(full, 'week').unix();
    const month = dateHelper.startOf(full, 'month').unix();
    return {
      full,
      day,
      week,
      month,
    };
  },
  /**
   * Returns a list of flair tags
   * @param {object} data Post data
   * @returns {Array} Post flair tags
   **/
  flair(data) {
    return _.chain(data).get('link_flair_text').castArray().compact().value();
  },
  /**
   * Returns the list of tags added to the title (between [])
   * @param {object} data Post data
   * @returns {Array} Title tags
   **/
  tags(data) {
    const regexp = /\[(?<tagName>.*?)\]/g;
    return _.chain(data)
      .get('title')
      .thru((title) => {
        const matches = Array.from(title.matchAll(regexp));
        return _.map(matches, 'groups.tagName');
      })
      .sort()
      .value();
  },
  score(data) {
    const comments = data.num_comments;
    const ups = data.ups;
    const downs = data.downs;
    const ratio = data.upvote_ratio;
    const value = data.score;
    return {
      comments,
      downs,
      ratio,
      ups,
      value,
    };
  },
};
