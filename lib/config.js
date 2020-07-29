const _ = require('golgoth/lib/lodash');

module.exports = {
  defaultConfig: {
    cachePath: './.cache',
    dataPath: './data',
    onEach(record) {
      return record;
    },
    incrementalWindow: [7, 'days'],
  },
  customConfig: {},
  get(key) {
    return _.get(this.customConfig, key, _.get(this.defaultConfig, key));
  },
  set(key, value) {
    return _.set(this.customConfig, key, value);
  },
  setAll(options) {
    _.each(options, (value, key) => {
      this.set(key, value);
    });
  },
};
