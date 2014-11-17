# Simple Feature Detector 
=======

[![Bower version][bower-image]][bower-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Windows Build Status][appveyor-image]][appveyor-url]

---

A very lightweight (847 bytes gzipped) dependency-free module to easily detect CSS features in the browser (and declare their support adding CSS classes to the HTML element).

### Usage
* [Download](https://github.com/adam-lynch/simple-feature-detector/raw/master/simple-feature-detector.min.js) / get from: [npm](https://www.npmjs.org/package/simple-feature-detector), [bower](http://bower.io/search/?q=simple-feature-detector) or [packagist](https://packagist.org/packages/adam-lynch/simple-feature-detector).

* Usage: [UMD](https://github.com/umdjs/umd) is supported so you can use this with AMDs / [RequireJS](http://requirejs.org/), commonjs / [browserify](http://browserify.org/), or simply by sticking the `<script>` in your HTML and use the global `SimpleFeatureDetector` function. See the [examples](https://github.com/adam-lynch/simple-feature-detector/tree/master/examples) for an example of each.

* Declare support for a feature
```js
SimpleFeatureDetector.supports({  property: 'column-width', vendors: 'wg' });
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
            { property: 'transform-style', vendors: '' } //will check for native support only
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
You'll be fine. Tested as far back as Internet Explorer 8.

-----------
\* You wouldn't want to check for a vendor+property combination when it never existed (like `o-border-radius`), among other possible reasons.


[npm-url]: https://npmjs.org/package/simple-feature-detector
[npm-image]: http://img.shields.io/npm/v/simple-feature-detector.svg?style=flat

[bower-url]: https://github.com/adam-lynch/simple-feature-detector
[bower-image]: http://img.shields.io/bower/v/simple-feature-detector.svg?style=flat

[travis-url]: http://travis-ci.org/adam-lynch/simple-feature-detector
[travis-image]: http://img.shields.io/travis/adam-lynch/simple-feature-detector.svg?style=flat

[appveyor-url]: https://ci.appveyor.com/project/adam-lynch/simple-feature-detector/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/7sxb7wcfyp03vk4c/branch/master?svg=true
