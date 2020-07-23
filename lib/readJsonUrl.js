const readJsonUrl = require('firost/lib/readJsonUrl');
const config = require('./config.js');
module.exports = async (url) => {
  return await readJsonUrl(url, { diskCache: config.get('cachePath') });
};
