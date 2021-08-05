const _ = require('golgoth/lodash');
const he = require('he');
const config = require('../config.js');
const dateHelper = require('./date.js');
const imoen = require('imoen');

// Maximum width/height to be used for the main picture
const PICTURE_MAX_DIMENSION = 600;
// Maximum filesize allowed (this is Cloudinary handling limit)
const PICTURE_MAX_FILESIZE = 10485760;

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
    const tags = this.tags(post);
    const date = this.date(post);

    const picture = await this.picture(post);
    if (!picture) {
      return null;
    }

    const score = this.score(post);

    const miscPostHint = post.post_hint;

    const record = {
      id,
      title,
      url,
      tags,
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
      misc: {
        postHint: miscPostHint,
      },
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
    const isDeleted = data.selftext === '[deleted]';
    return isDeleted;
  },
  /**
   * Returns a picture object with all metadata, including dimensions, lqip and
   * url to various versions
   * @param {object} data Post data
   * @returns {object} The picture object
   **/
  async picture(data) {
    const url = this.pictureUrl(data.preview, PICTURE_MAX_DIMENSION);
    if (!url) {
      return null;
    }

    const { width, height, lqip, filesize, hash } = await this.__imoen(url);
    if (!width || !height || filesize > PICTURE_MAX_FILESIZE) {
      return null;
    }

    const thumbnailUrl = data.thumbnail;
    const fullUrl = this.pictureFullUrl(data.preview);

    return {
      url,
      width,
      height,
      lqip,
      filesize,
      hash,
      thumbnailUrl,
      fullUrl,
    };
  },
  /**
   * Returns a picture url from a given post
   * @param {object} previews Preview object
   * @param {number} minWidth Minimum width
   * @returns {string} Url of the preview, or the source if no preview found
   **/
  pictureUrl(previews, minWidth) {
    const firstImg = _.get(previews, 'images[0]', false);
    if (!firstImg) {
      return false;
    }

    return _.chain(firstImg)
      .get('resolutions', [])
      .sortBy('width')
      .find((resolution) => {
        return resolution.width >= minWidth;
      })
      .get('url')
      .replace(/&amp;/g, '&')
      .value();
  },
  /**
   * Returns a picture url from a given post
   * @param {object} previews Preview object
   * @returns {string} Url of picture
   */
  pictureFullUrl(previews) {
    const firstImg = _.get(previews, 'images[0]', false);
    if (!firstImg) {
      return false;
    }
    return _.chain(firstImg).get('source.url').replace(/&amp;/g, '&').value();
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
   * Returns a list of tags
   * Tags are read from the flair text
   * @param {object} data Post data
   * @returns {Array} Post tags
   **/
  tags(data) {
    return _.chain(data).get('link_flair_text').castArray().compact().value();
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
  __imoen: imoen,
};
