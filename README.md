# Simple Feature Detector v0.0.5 [![Build Status](https://travis-ci.org/adam-lynch/simple-feature-detector.png)](https://travis-ci.org/adam-lynch/simple-feature-detector)

A very lightweight (850 bytes gzipped) dependency-free [AMDS](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) module to easily detect CSS features in the browser (and declare their support adding CSS classes to the HTML element).

### Usage
* [Download](https://github.com/adam-lynch/simple-feature-detector/raw/master/simple-feature-detector.min.js)

* Either:
  * In your AMDS module, declare simple-feature-detector as a dependency;
```js
define(['simple-feature-detector'], function( SimpleFeatureDetector ){
        // do your thing...
});
```
See the [RequireJS documentation](http://requirejs.org/docs/start.html) for further help if needed.  
  
  * Or use the global `SimpleFeatureDetector` global function (i.e. do nothing and just carry on to the next step).

* Declare support for a feature
```js
SimpleFeatureDetector.supports({  property: 'column-width', vendors: 'wg' }));
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
SimpleFeatureDetector.supports([
            { property: 'column-width', vendors: 'wg' },
            { property: 'border-radius', vendors: 'all' },
            { property: 'transform-style', vendors: '' }//will check for native support only
        ]);
```
* To simply determine if a feature is supported without adding classes to the DOM, use the second parameter `declareSupport` (which defaults to `true`)
```js
if(SimpleFeatureDetector.supports( { property: 'column-width', vendors: 'wg' }, false )){
            alert('Yes!');
        }
```

* Caching: There is none. Use this wisely :)

-----------

### Browser support
Since it currently uses [element.classList](https://developer.mozilla.org/en/docs/DOM/element.classList)<del>, support is [limited](http://caniuse.com/#search=classlist) to modern browsers</del> and I've built in a fallback for it, don't worry about browser support :)

-----------
\* You wouldn't want to check for a vendor+property combination when it never existed (like `o-border-radius`), among other possible reasons.
