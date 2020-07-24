const dayjs = require('golgoth/lib/dayjs');
const utc = require('golgoth/lib/dayjs/plugin/utc');
const isSameOrBefore = require('golgoth/lib/dayjs/plugin/isSameOrBefore');
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
module.exports = {
  /**
   * Returns the current timestamp, in UTC
   * @returns {number} UTC timestamp
   * */
  now() {
    return dayjs().utc().unix();
  },
  /**
   * Returns a dayjs object from the start of the month
   * @param {number} timestamp UTC timestamp
   * @returns {object} Dayjs object representing the start of the month
   **/
  startOfMonth(timestamp) {
    return dayjs.unix(timestamp).utc().startOf('month');
  },
  /**
   * Check if first date is same or before second date
   * @param {object} first Dayjs object
   * @param {object} second Dayjs object
   * @returns {boolean} True if first is same or before second
   **/
  isSameOrBefore(first, second) {
    return first.isSameOrBefore(second);
  },
  /**
   * Return the path as YYYY/MM from a date
   * @param {number} timestamp UTC timestamp
   * @returns {string} YYYY/MM string
   **/
  path(timestamp) {
    return dayjs.unix(timestamp).utc().format('YYYY/MM');
  },
  /**
   * Display a timestamp in a local, readable format
   * @param {number} timestamp UTC timestamp to display
   * @returns {string} Readable output string
   **/
  display(timestamp) {
    return dayjs.unix(timestamp).format('MMMM D, YYYY at h:mm A');
  },
};
