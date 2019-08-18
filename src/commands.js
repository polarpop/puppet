import utils from './utils';
import { Scrappy } from './';

export const run = async (instance) => {
  let start = new Date();
  let opts = {
    headless: instance.headless,
    multiple: instance.multiple,
    noOutput: instance.noOutput,
    excludedPages: instance.excludedPages,
    runs: instance.runs,
    pagesDir: utils.getPagesDir(instance.pagesDir),
  };
  try {
    let pages = await utils.getPagesFromPageDir({
      dir: opts.pagesDir,
      excluded: opts.excludedPages,
      runs: opts.runs
    });
    if (pages) {
      const scrappy = new Scrappy({ headless: opts.headless });
      scrappy.on('end', () => {
        let end = new Date();
        let difference = start.getTime() - end.getTime();
        difference = difference / 1000;
        difference = Math.abs(difference);
        let successMessage = `
          Successfully completed your webscrapes

          Time Taken: ${difference} seconds
        `;
        console.log(utils.colors.success(successMessage));
      })
      if (!opts.noOutput) {
        scrappy.on('data', (data) => {
          console.log('Message: ' + utils.colors.verbose(JSON.stringify(data)));
        });
      }

      scrappy.on('error', (err) => {
        utils.commandEmitter.emit('error', err, false);
      });
      for (let [ key, value ] of pages.entries()) {
        if (!opts.multiple) {
          await scrappy.addPage(`${key}`, value);
          await scrappy.run(`${key}`);
          await scrappy.removePage(`${key}`);
        } else {
          await scrappy.addPage(`${key}`, value);
        }
      }
      if (opts.multiple) {
        await scrappy.run();
      }
    }
    
  } catch (e) {
    utils.commandEmitter.emit('error', e);
  }
};