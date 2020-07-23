const helper = require('../helper.js');
const _ = require('golgoth/lib/lodash');

module.exports = {
  /**
   * Download all posts as records on disk
   * @param {object} cliArgs CLI Argument object, as created by minimist
   * @returns {boolean} True on success, false otherwise
   **/
  async run(cliArgs = {}) {
    const subredditName = _.get(cliArgs, '_[0]');
    const data = await helper.creationDate(subredditName);
    console.info(data);
  },
};
