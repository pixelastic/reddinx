const readJsonUrl = require('firost/lib/readJsonUrl');
module.exports = {
  async creationDate(subredditName) {
    const url = `https://www.reddit.com/r/${subredditName}/about.json`;
    const subredditData = await readJsonUrl(url);
    console.info(subredditData);
  },
};
