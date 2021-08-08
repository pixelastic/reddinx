const readJsonUrl = require('firost/readJsonUrl');
const config = require('../config.js');
module.exports = async (url) => {
  return await readJsonUrl(url, { diskCache: config.cachePath() });
};
