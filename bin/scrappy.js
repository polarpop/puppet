#!/usr/bin/env node

const Scrappy = require('../lib');
const { utils } = require('../lib');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .description('Run scrappy from your cli')
  .version('1.0.0', '-V, --version')
  .option('-H, --headless', 'Run a headless version of chrome', false)
  .option('-R, --runs <number>', 'How many times you want to run the page in chrome', 1)
  .option('-ND, --no-data', 'Runs scrappy without outputting data from the webbrowser', false)
  .option('-M, --multiple', 'Run multiple chrome pages at once', true)
  .option('-P, --pages-dir <dir>', 'The directory where all your page json files sit.', process.cwd())
  .option('-E, --exclude <pages>', 'Exclude a page or pages from your page directory.', [])
  .action(function(instance, options) {
      var pages = [],
        opts = {
          headless: instance.headless,
          runs: instance.runs,
          mutliple: instance.multiple,
          excluded: instance.exclude,
          noData: instance.noData,
          pagesDir: instance.pagesDir
        };

      console.log(instance);
  });

program.parse(process.argv);

process.exit(0);