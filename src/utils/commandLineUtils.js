import path from 'path';
import fs from 'fs';
import uuid from 'uuid/v4';
import { EventEmitter } from 'events';

import colors from './colors';
import { readdir, stat } from './promiseUtils';



export const parseCommaSeparated = (value, prev) => {
  if (/\,/.test(value)) {
    return value.split(',');
  }
  return [];
};

export const getPagesDir = (dir) => {
  if (!dir) return process.cwd();
  return path.resolve(dir);
};

export const getPagesFromPageDir = async ({ dir, excluded=[], runs=1 }) => {
  let pages = new Map();
  let excludes = [...excluded, 'package.json'];
  let filenames;

  try {
    filenames = await readdir(dir);
  } catch (e) {
    console.log(e)
    throw e;
  };

  if (filenames) {
    filenames = filenames.filter(filename => !excludes.includes(filename) && path.parse(filename).ext === '.json');

    for (var i in filenames) {
      let filepath = path.resolve(dir, filenames[i]);

      let _stat = await stat(filepath);

      if (_stat) {
        if (_stat.isFile()) {
          let module = await require(filepath);

          if (module.hasOwnProperty('steps')) {
            let name = path.parse(filenames[i]).name;
            if (pages.has(name)) {
              name = `${name}_${uuid()}`;
            }
            let steps = module.steps;
            pages.set(name, steps);
            if (runs > 1) {
              if (runs > 5) throw new Error('You cannot have more than 5 runs running concurrently.\nPlease run in single mode or limit the amount of concurrent tests to 5.');
              for (let r=1;r<runs;r++) {
                pages.set(`${name}${r}`, module.steps);
              }
            }
          }
        }
      }
    }
  }
  return await pages;
};

export const commandEmitter = new EventEmitter();