const dayjs = require('golgoth/dayjs');
module.exports = {
  dayjs,
  /**
   * Returns the current timestamp, in UTC
   * @returns {number} UTC timestamp
   * */
  now() {
    return dayjs.utc().unix();
  },
  /**
   * Returns a dayjs object for a given month
   * @param {number} year Year
   * @param {number} month Month number
   * @returns {object} dayjs object
   **/
  month(year, month) {
    return dayjs.utc().year(year).month(month).startOf('month');
  },
  /**
   * Returns a dayjs object from a timestamp
   * @param {number} timestamp UTC timestamp
   * @returns {object} dayjs object
   **/
  fromTimestamp(timestamp) {
    return dayjs.unix(timestamp).utc();
  },
  /**
   * Returns a dayjs object from the start of the month
   * @param {number} timestamp UTC timestamp
   * @param {string} period Named dayjs period, like month, day or week
   * @returns {object} Dayjs object representing the start of the period
   **/
  startOf(timestamp, period) {
    return this.fromTimestamp(timestamp).startOf(period);
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
    return this.fromTimestamp(timestamp).format('YYYY/MM');
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
