# simple-feature-detector

A very lightweight dependency-free [AMDS](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) module to easily detect CSS features in the browser (and declare their support adding CSS classes to the HTML element).

### Usage
* Download

* In your AMDS module, declare simple-feature-detector as a dependency;
```js
define(['simple-feature-detector'], function( simpleFeatureDetector ){
    // do your thing...
});
```
See the [RequireJS documentation](http://requirejs.org/docs/start.html) for further help if needed.

* Check support for a feature
```js
if(simpleFeatureDetector.declareSupportFor({ 'column-width', 'wg' })){
    alert('Yes!');
}
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

* Check support for multiple features
```js
if(simpleFeatureDetector.declareSupportFor([
        { 'column-width', 'wg' },
        { 'border-radius', 'all' }
    ])){
   
    alert('Both!');
}
```
* Check support for multiple features and declare support with CSS classes:
```js
simpleFeatureDetector.declareSupportFor([
    { 'column-width', 'wg' },
    { 'border-radius', 'all' }
])
```
The result: `<html class="has-column-width has-border-radius">...</html>`
```
This also returns a boolean like the others (but it will not break if there's a failure / missing feature in the list).

* Caching: There is none. Use this wisely :)

-----------
\* You wouldn't want to check for a vendor+property combination when it never existed (like `o-border-radius`), among other possible reasons. 