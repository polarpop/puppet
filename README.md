# scrappy
Easy to use simple webscrapper built off Node.js ES2018 and Google's Puppeteer.

## Installation
You can install scrappy by either yarn or NPM.

### npm
`npm install @movement-mortgage/scrappy`

### yarn
`yarn add @movement-mortgage/scrappy`

## Usage
This is not for advanced usage, but it does make using puppeteer less tedious, by combining steps, and pages. See below for examples.

### Search Google

```javascript
const Scrappy = require('@movement-mortgage/scrappy');

const scrapper = new Scrappy({ headless: false });

let searchSelector = '#tsf > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > input';
let searchBtnSelector = '#tsf > div:nth-child(2) > div > div:nth-child(2) > center > input[value="Google Search"]';
let resultsSelector = '#rso > div:nth-child(2) > div > div > div > div > div.r > a';
let evalFn = `
  selector => {
    let results = Array.from(document.querySelectorAll(selector));
    return results.map(res => {
      return 'Link: ' + res.href;
    })
  }
`;

let steps = [
  { goto: 'https://google.com' },
  { waitForSelector: ['form[action="/search"]'] },
  { type: [searchSelector, "searchPhrase"] },
  { waitForSelector: [searchBtnSelector] },
  { click: [searchBtnSelector] },
  { evaluate: [ evalFn, resultsSelector ] }
];

let props = { searchPhrase: 'What Ever I want' };

scrapper.addPage('google', steps, props);

scrapper.run()
  .then(page => {
    console.log(page);
  })
  .catch(err => {
    console.log('Error: ', err.message);
  })

```

### Search multiple pages at once

```javascript
const Scrappy = require('@movement-mortgage/scrappy');

const scrapper = new Scrappy({ headless: false });

let searchSelector = '#tsf > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > input';
let searchBtnSelector = '#tsf > div:nth-child(2) > div > div:nth-child(2) > center > input[value="Google Search"]';
let resultsSelector = '#rso > div:nth-child(2) > div > div > div > div > div.r > a';
let evalFn = `
  selector => {
    let results = Array.from(document.querySelectorAll(selector));
    return results.map(res => {
      return 'Link: ' + res.href;
    })
  }
`;

let steps = [
  { goto: 'https://google.com' },
  { waitForSelector: ['form[action="/search"]'] },
  { type: [searchSelector, "searchPhrase"] },
  { waitForSelector: [searchBtnSelector] },
  { click: [searchBtnSelector] },
  { evaluate: [ evalFn, resultsSelector ] }
];

let props = { searchPhrase: 'What Ever I want' };
let props2 = { searchPhrase: 'Puppeteer' };
scrapper.addPage('google', steps, props);
scrapper.addPage('google2', steps, props2)

scrapper.run()
  .then(page => {
    console.log(page);
  })
  .catch(err => {
    console.log('Error: ', err.message);
  })

```
### Specify a page with multiple pages

```javascript
const Scrappy = require('@movement-mortgage/scrappy');

const scrapper = new Scrappy({ headless: false });

let searchSelector = '#tsf > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > input';
let searchBtnSelector = '#tsf > div:nth-child(2) > div > div:nth-child(2) > center > input[value="Google Search"]';
let resultsSelector = '#rso > div:nth-child(2) > div > div > div > div > div.r > a';
let evalFn = `
  selector => {
    let results = Array.from(document.querySelectorAll(selector));
    return results.map(res => {
      return 'Link: ' + res.href;
    })
  }
`;

let steps = [
  { goto: 'https://google.com' },
  { waitForSelector: ['form[action="/search"]'] },
  { type: [searchSelector, "searchPhrase"] },
  { waitForSelector: [searchBtnSelector] },
  { click: [searchBtnSelector] },
  { evaluate: [ evalFn, resultsSelector ] }
];

let props = { searchPhrase: 'What Ever I want' };
let props2 = { searchPhrase: 'Puppeteer' };
scrapper.addPage('google', steps, props);
scrapper.addPage('google2', steps, props2)

scrapper.run('google')
  .then(page => {
    // only scrapes the first page.
    console.log(page);
  })
  .catch(err => {
    console.log('Error: ', err.message);
  })

```