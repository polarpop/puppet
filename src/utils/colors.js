import chalk from 'chalk';

export default {
  error: text => chalk.red(text),
  success: text => chalk.green(text),
  info: text => chalk.blue(text),
  verbose: text => chalk.yellow(text)
};