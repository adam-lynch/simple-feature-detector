# Simple Feature Detector v0.0.4 [![Build Status](https://travis-ci.org/adam-lynch/simple-feature-detector.png)](https://travis-ci.org/adam-lynch/simple-feature-detector)

A very lightweight (850 bytes gzipped) dependency-free [AMDS](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) module to easily detect CSS features in the browser (and declare their support adding CSS classes to the HTML element).

### Usage
* [Download](https://github.com/adam-lynch/simple-feature-detector/raw/master/simple-feature-detector.min.js)

* In your AMDS module, declare simple-feature-detector as a dependency;
```js
define(['simple-feature-detector'], function( simpleFeatureDetector ){
        // do your thing...
});
```
See the [RequireJS documentation](http://requirejs.org/docs/start.html) for further help if needed.

* Declare support for a feature
```js
simpleFeatureDetector.supports({ 'column-width', 'wg' }))
```
Each object contains the CSS property desired and the vendors which it should check for*, _if_ it's not supported natively. 
Possible values:
 * `g` - Gecko (Firefox)
 * `k` - KHTML (Konqueror)
 * `p` - Presto (Opera)
 * `t` - Trident (IE)
 * `w` - WebKit
 * `all` - All of the above
 * `""` - return false if not supported natively

 The result: `<html class="has-column-width">...</html>`

* Check support for multiple features
```js
simpleFeatureDetector.supports([
            { 'column-width', 'wg' },
            { 'border-radius', 'all' }
        ]);
```
* To simply determine if a feature is supported without adding classes to the DOM, use the second parameter `declareSupport` (which defaults to `true`)
```js
if(simpleFeatureDetector.supports( { 'column-width', 'wg' }, false )){
            alert('Yes!');
        }
```

* Caching: There is none. Use this wisely :)

-----------

### Browser support
Since it currently uses [element.classList](https://developer.mozilla.org/en/docs/DOM/element.classList)<del>, support is [limited](http://caniuse.com/#search=classlist) to modern browsers</del> and I've built in a fallback for it, don't worry about browser support :)

-----------
\* You wouldn't want to check for a vendor+property combination when it never existed (like `o-border-radius`), among other possible reasons. 
