#!/usr/bin/env node

const { utils, commands } = require('../lib');
const program = require('commander');

program
  .description('Run scrappy from your cli')
  .version('1.0.0', '-V, --version')
  .option('--headless', 'Run a headless version of chrome', false)
  .option('--runs <number>', 'How many times you want to run the page in chrome', 1)
  .option('--no-output', 'Runs scrappy without outputting data from the webbrowser', false)
  .option('--multiple', 'Run multiple chrome pages at once', false)
  .option('--pages-dir <dir>', 'The directory where all your page json files sit.', process.cwd())
  .option('--excluded-pages <pages>', 'Exclude a page or pages from your page directory.', utils.parseCommaSeparated, [])
  .action(function(instance, options) {
    commands.run(instance);
  });

utils.commandEmitter.on('error', function(err, shouldEnd=true) {
  console.error(utils.colors.error(err.message));
  if (shouldEnd) {
    process.exit(1);
  }
});

program.parse(process.argv);