import util from 'util';
import fs from 'fs';

export const readdir = util.promisify(fs.readdir);

export const stat = util.promisify(fs.stat);