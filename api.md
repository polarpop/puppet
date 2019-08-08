## Classes

<dl>
<dt><a href="#Browser">Browser</a></dt>
<dd></dd>
<dt><a href="#Scrappy">Scrappy</a></dt>
<dd></dd>
<dt><a href="#Scrappy">Scrappy</a></dt>
<dd></dd>
<dt><a href="#Pages">Pages</a></dt>
<dd></dd>
<dt><a href="#Steps">Steps</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#VALID_STEP_METHODS">VALID_STEP_METHODS</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>The valid steps that can be used from puppeteer. Not all of the page steps are included
in this array since some are not necessary for this application.</p>
</dd>
</dl>

<a name="Browser"></a>

## Browser
**Kind**: global class  
<a name="Scrappy"></a>

## Scrappy
**Kind**: global class  

* [Scrappy](#Scrappy)
    * [new Scrappy()](#new_Scrappy_new)
    * [.pages](#Scrappy+pages)
    * [.browser](#Scrappy+browser)
    * [.addPage(id, steps, props)](#Scrappy+addPage) ⇒ <code>void</code>
    * [.removePage(id)](#Scrappy+removePage) ⇒ <code>void</code>
    * [.run(pageId)](#Scrappy+run) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="new_Scrappy_new"></a>

### new Scrappy()
Manages the puppeteer browser instance, can add pages, can delete pages,and can run the pages either by specific ID or all at once.

<a name="Scrappy+pages"></a>

### scrappy.pages
The Map of pages in the `PageManager` property.

**Kind**: instance property of [<code>Scrappy</code>](#Scrappy)  
**Properties**

| Type |
| --- |
| <code>Pages.pages</code> \| <code>undefined</code> | 

<a name="Scrappy+browser"></a>

### scrappy.browser
The browser instance from the `BrowserManager`. Used to launcha new browser.

**Kind**: instance property of [<code>Scrappy</code>](#Scrappy)  
**Properties**

| Type |
| --- |
| <code>Browser.browser</code> \| <code>undefined</code> | 

<a name="Scrappy+addPage"></a>

### scrappy.addPage(id, steps, props) ⇒ <code>void</code>
Adds a page instance to the page manager. When using the Scrappy.run methodthis will iterate through the `PageManager` property pages instance.

**Kind**: instance method of [<code>Scrappy</code>](#Scrappy)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The unique id for the page you are trying to add. |
| steps | <code>Array.&lt;object.&lt;(Array.&lt;string&gt;\|string)&gt;&gt;</code> | An array of objects with the key of the command you are attempting to run in the puppeteer instance and the value of the steps which can either be a string or an array of strings. |
| props | <code>Object.&lt;string&gt;</code> | The properties you want to set for each step. Generally, these are dynamic values such as a username and password input. |

**Example**  
```js
import uuid from 'uuid/v4';import Scrappy from '@movement-mortgage/scrappy';const pageId = uuid();const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];const props = { password: 'This is a dynamic value password' };const scrappy = new Scrappy({ headless: false });scrappy.addPage(pageId, steps, props);scrappy.run();// orscrappy.run(pageId) 
```
<a name="Scrappy+removePage"></a>

### scrappy.removePage(id) ⇒ <code>void</code>
Removes the page from the `PageManager` instance. When you use the `run` method next time,the page that was removed will not be run.

**Kind**: instance method of [<code>Scrappy</code>](#Scrappy)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the page you want to remove. |

**Example**  
```js
import uuid from 'uuid/v4';import Scrappy from '@movement-mortgage/scrappy';const pageId = uuid();const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];const props = { password: 'This is a dynamic value password' };const scrappy = new Scrappy({ headless: false });scrappy.addPage(pageId, steps, props);scrappy.run();// orscrappy.run(pageId);// Now let's remove the pagescrappy.removePage(pageId);console.log(scrappy.pages.has(pageId)) // outputs false// That page will no longer appear.scrappy.run();
```
<a name="Scrappy+run"></a>

### scrappy.run(pageId) ⇒ <code>Promise.&lt;any&gt;</code>
Launches the puppeteer instance from the `BrowserManager` if one doesnot already exists. Iterates through all pages in the `PageManager` propertyinstance, or if the optional parameter of `pageId` is defined, then just runthat one page.

**Kind**: instance method of [<code>Scrappy</code>](#Scrappy)  
**Returns**: <code>Promise.&lt;any&gt;</code> - returns the close method of the `BrowserManager` property.  

| Param | Type | Description |
| --- | --- | --- |
| pageId | <code>string</code> | The id of the page that you want to run, if the page does not exist then throw an error, if the page id is undefined then run all pages in the `PageManager` property. |

**Example**  
```js
import uuid from 'uuid/v4';import Scrappy from '@movement-mortgage/scrappy';const pageId = uuid();const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];const props = { password: 'This is a dynamic value password' };const scrappy = new Scrappy({ headless: false });// see `addPage` method for further detailsscrappy.addPage(pageId, steps, props);scrappy.run();// orscrappy.run(pageId);
```
<a name="Scrappy"></a>

## Scrappy
**Kind**: global class  
**Params**: <code>Object</code> browserOpts The options used for the puppeteer launch instance. See https://github.com/GoogleChrome/puppeteerfor further details  

* [Scrappy](#Scrappy)
    * [new Scrappy()](#new_Scrappy_new)
    * [.pages](#Scrappy+pages)
    * [.browser](#Scrappy+browser)
    * [.addPage(id, steps, props)](#Scrappy+addPage) ⇒ <code>void</code>
    * [.removePage(id)](#Scrappy+removePage) ⇒ <code>void</code>
    * [.run(pageId)](#Scrappy+run) ⇒ <code>Promise.&lt;any&gt;</code>

<a name="new_Scrappy_new"></a>

### new Scrappy()
Manages the puppeteer browser instance, can add pages, can delete pages,and can run the pages either by specific ID or all at once.

<a name="Scrappy+pages"></a>

### scrappy.pages
The Map of pages in the `PageManager` property.

**Kind**: instance property of [<code>Scrappy</code>](#Scrappy)  
**Properties**

| Type |
| --- |
| <code>Pages.pages</code> \| <code>undefined</code> | 

<a name="Scrappy+browser"></a>

### scrappy.browser
The browser instance from the `BrowserManager`. Used to launcha new browser.

**Kind**: instance property of [<code>Scrappy</code>](#Scrappy)  
**Properties**

| Type |
| --- |
| <code>Browser.browser</code> \| <code>undefined</code> | 

<a name="Scrappy+addPage"></a>

### scrappy.addPage(id, steps, props) ⇒ <code>void</code>
Adds a page instance to the page manager. When using the Scrappy.run methodthis will iterate through the `PageManager` property pages instance.

**Kind**: instance method of [<code>Scrappy</code>](#Scrappy)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The unique id for the page you are trying to add. |
| steps | <code>Array.&lt;object.&lt;(Array.&lt;string&gt;\|string)&gt;&gt;</code> | An array of objects with the key of the command you are attempting to run in the puppeteer instance and the value of the steps which can either be a string or an array of strings. |
| props | <code>Object.&lt;string&gt;</code> | The properties you want to set for each step. Generally, these are dynamic values such as a username and password input. |

**Example**  
```js
import uuid from 'uuid/v4';import Scrappy from '@movement-mortgage/scrappy';const pageId = uuid();const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];const props = { password: 'This is a dynamic value password' };const scrappy = new Scrappy({ headless: false });scrappy.addPage(pageId, steps, props);scrappy.run();// orscrappy.run(pageId) 
```
<a name="Scrappy+removePage"></a>

### scrappy.removePage(id) ⇒ <code>void</code>
Removes the page from the `PageManager` instance. When you use the `run` method next time,the page that was removed will not be run.

**Kind**: instance method of [<code>Scrappy</code>](#Scrappy)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the page you want to remove. |

**Example**  
```js
import uuid from 'uuid/v4';import Scrappy from '@movement-mortgage/scrappy';const pageId = uuid();const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];const props = { password: 'This is a dynamic value password' };const scrappy = new Scrappy({ headless: false });scrappy.addPage(pageId, steps, props);scrappy.run();// orscrappy.run(pageId);// Now let's remove the pagescrappy.removePage(pageId);console.log(scrappy.pages.has(pageId)) // outputs false// That page will no longer appear.scrappy.run();
```
<a name="Scrappy+run"></a>

### scrappy.run(pageId) ⇒ <code>Promise.&lt;any&gt;</code>
Launches the puppeteer instance from the `BrowserManager` if one doesnot already exists. Iterates through all pages in the `PageManager` propertyinstance, or if the optional parameter of `pageId` is defined, then just runthat one page.

**Kind**: instance method of [<code>Scrappy</code>](#Scrappy)  
**Returns**: <code>Promise.&lt;any&gt;</code> - returns the close method of the `BrowserManager` property.  

| Param | Type | Description |
| --- | --- | --- |
| pageId | <code>string</code> | The id of the page that you want to run, if the page does not exist then throw an error, if the page id is undefined then run all pages in the `PageManager` property. |

**Example**  
```js
import uuid from 'uuid/v4';import Scrappy from '@movement-mortgage/scrappy';const pageId = uuid();const steps = [{ goto: 'https://example.com' }, { type: [ '#browser', 'password' ] }];const props = { password: 'This is a dynamic value password' };const scrappy = new Scrappy({ headless: false });// see `addPage` method for further detailsscrappy.addPage(pageId, steps, props);scrappy.run();// orscrappy.run(pageId);
```
<a name="Pages"></a>

## Pages
**Kind**: global class  
<a name="Steps"></a>

## Steps
**Kind**: global class  
<a name="VALID_STEP_METHODS"></a>

## VALID\_STEP\_METHODS : <code>Array.&lt;string&gt;</code>
The valid steps that can be used from puppeteer. Not all of the page steps are includedin this array since some are not necessary for this application.

**Kind**: global constant  
