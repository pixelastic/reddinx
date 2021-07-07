const { glob, writeJson, readJson, remove, spinner } = require('firost');
const pMap = require('golgoth/pMap');
const path = require('path');
const config = require('../config.js');

/**
 * Update all local record files by applying onEach on them
 * @param {string} subredditName Name of the subreddit to download
 * @param {object} options Options to override the default config
 **/
const localUpdate = async (subredditName, options = {}) => {
  await config.init(options);

  const globRoot = path.resolve(config.dataPath(), subredditName);
  const files = await glob(`${globRoot}/**/*.json`);
  const max = files.length;
  const progress = localUpdate.__spinner(max);

  await pMap(
    files,
    async (filepath) => {
      const currentData = await readJson(filepath);
      const newData = await config.onEach()(currentData);
      newData ? await writeJson(newData, filepath) : await remove(filepath);

      progress.tick(filepath);
    },
    { concurrency: 50 }
  );
  progress.success('All files updated');
};

localUpdate.__spinner = spinner;

module.exports = localUpdate;
