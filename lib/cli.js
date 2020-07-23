const minimist = require('minimist');
const consoleError = require('firost/lib/consoleError');
const exit = require('firost/lib/exit');
const _ = require('golgoth/lib/lodash');

module.exports = {
  /**
   * List of allowed commands to run
   * @returns {Array} List of allowed commands to run
   **/
  safelist() {
    return ['initial', 'incremental'];
  },
  /**
   * Run the command specified on the command-line, along with specific
   * arguments
   * @param {Array} rawArgs CLI args
   **/
  async run(rawArgs) {
    const args = minimist(rawArgs);

    const commandName = args._[0];
    if (!_.includes(this.safelist(), commandName)) {
      this.__consoleError(`Unknown command ${commandName}`);
      this.__exit(1);
      return;
    }

    // Remove the initial method from args passed to the command
    args._ = _.drop(args._, 1);

    try {
      const command = this.__require(`./commands/${commandName}`);
      await command(args._[0]);
    } catch (err) {
      this.__consoleError(err.message);
      this.__exit(1);
    }
  },
  __consoleError: consoleError,
  __exit: exit,
  __require: require,
};
