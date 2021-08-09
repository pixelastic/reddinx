const _ = require('golgoth/lodash');
const imoen = require('imoen');

// Maximum width/height to be used for the main picture
const PICTURE_MAX_DIMENSION = 600;
// Maximum filesize allowed (this is Cloudinary handling limit)
const PICTURE_MAX_FILESIZE = 10485760;

module.exports = {
  /**
   * Returns a picture object with all metadata, including dimensions, lqip and
   * url to full version
   * @param {object} data Post data
   * @returns {object} The picture object
   **/
  async getMetadata(data) {
    const url = this.url(data, PICTURE_MAX_DIMENSION);
    if (!url) {
      return null;
    }

    const { width, height, lqip, filesize, hash } = await this.__imoen(url);
    if (!width || !height || filesize > PICTURE_MAX_FILESIZE) {
      return null;
    }

    const fullUrl = this.fullUrl(data);

    return {
      url,
      width,
      height,
      lqip,
      filesize,
      hash,
      fullUrl,
    };
  },
  /**
   * Check if the post is a gallery
   * @param {object} data Post data
   * @returns {boolean} True if a gallery
   **/
  isGalleryPost(data) {
    return _.has(data, 'gallery_data');
  },
  /**
   * Check if the post is a simple picture post
   * @param {object} data Post data
   * @returns {boolean} True if a simple picture
   **/
  isPicturePost(data) {
    return _.has(data, 'preview');
  },
  /**
   * Returns the full url to any post main picture
   * @param {object} data Post data
   * @returns {string} Url of picture
   */
  fullUrl(data) {
    if (this.isPicturePost(data)) {
      return this.fullUrlPicture(data);
    }

    if (this.isGalleryPost(data)) {
      return this.fullUrlGallery(data);
    }

    return false;
  },
  /**
   * Returns the full url to a picture post main picture
   * @param {object} data Post data
   * @returns {string} Url of picture
   */
  fullUrlPicture(data) {
    const url = _.get(data, 'preview.images[0].source.url', false);
    return url ? url.replace(/&amp;/g, '&') : false;
  },
  /**
   * Returns the full url to a gallery post main picture
   * @param {object} data Post data
   * @returns {string} Url of picture
   */
  fullUrlGallery(data) {
    const firstPictureId = _.get(data, 'gallery_data.items[0].media_id', false);
    const url = _.get(data, `media_metadata.${firstPictureId}.s.u`, false);
    return url ? url.replace(/&amp;/g, '&') : false;
  },
  /**
   * Returns a picture url from a given post
   * @param {object} data Post data
   * @param {number} minWidth Minimum width
   * @returns {string} Url of closest matching picture
   **/
  url(data, minWidth) {
    if (this.isPicturePost(data)) {
      return this.urlPicture(data, minWidth);
    }

    if (this.isGalleryPost(data)) {
      return this.urlGallery(data, minWidth);
    }

    return false;
  },
  /**
   * Returns a picture url from a picture post
   * @param {object} data Post data
   * @param {number} minWidth Minimum width
   * @returns {string} Url of closest matching picture
   **/
  urlPicture(data, minWidth) {
    const firstImg = _.get(data, 'preview.images[0]', false);
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
   * Returns a picture url from a gallery post
   * @param {object} data Post data
   * @param {number} minWidth Minimum width
   * @returns {string} Url of closest matching picture
   **/
  urlGallery(data, minWidth) {
    const firstPictureId = _.get(data, 'gallery_data.items[0].media_id', false);

    const previews = _.get(data, `media_metadata.${firstPictureId}.p`, []);
    const fullSize = _.get(data, `media_metadata.${firstPictureId}.s`, null);
    previews.push(fullSize);

    return _.chain(previews)
      .sortBy('x')
      .find((preview) => {
        return preview.x >= minWidth;
      })
      .get('u')
      .replace(/&amp;/g, '&')
      .value();
  },
  __imoen: imoen,
};
