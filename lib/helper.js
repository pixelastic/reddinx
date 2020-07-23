const _ = require('golgoth/lib/lodash');
const dayjs = require('golgoth/lib/dayjs');
const isSameOrBefore = require('golgoth/lib/dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);
const pMap = require('golgoth/lib/pMap');
const readJsonUrl = require('./readJsonUrl.js');
const config = require('./config.js');
const postIdsHelper = require('./helpers/postIds.js');
const postsHelper = require('./helpers/posts.js');
const recordsHelper = require('./helpers/records.js');
const path = require('path');
const writeJson = require('firost/lib/writeJson');

module.exports = {
  async creationDate(subredditName) {
    const url = `https://www.reddit.com/r/${subredditName}/about.json`;
    const data = await readJsonUrl(url);
    return _.get(data, 'data.created_utc');
  },
  async forEachMonth(subredditName, callback) {
    const creationDate = await this.creationDate(subredditName);

    const startOfCreationMonth = dayjs.unix(creationDate).startOf('month');
    const endOfCurrentMonth = dayjs().endOf('month');

    // Build the list of year/months
    let current = startOfCreationMonth;
    const items = [];
    while (current.isSameOrBefore(endOfCurrentMonth)) {
      const year = current.year();
      const month = current.month() + 1;
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
  async saveRecords(subredditName, year, month) {
    const posts = await this.getPosts(subredditName, year, month);
    await pMap(
      posts,
      async (post) => {
        const record = recordsHelper.fromPost(post);
        if (!record) {
          return;
        }
        const { id } = record;
        const savePath = path.resolve(
          config.get('dataPath'),
          subredditName,
          `${year}`,
          _.padStart(month, 2, '0'),
          `${id}.json`
        );
        await writeJson(record, savePath);
      },
      { concurrency: 100 }
    );
  },
  async getPosts(subredditName, year, month) {
    const postIds = await postIdsHelper.fromMonth(subredditName, year, month);
    return postsHelper.fromIds(subredditName, postIds);
  },
};
