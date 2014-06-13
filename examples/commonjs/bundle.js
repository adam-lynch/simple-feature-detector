(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
SimpleFeatureDetector = require('./simple-feature-detector.min');
SimpleFeatureDetector.supports({  property: 'column-width', vendors: 'wg' });
},{"./simple-feature-detector.min":2}],2:[function(require,module,exports){
// simple-feature-detector v0.0.6 - https://github.com/adam-lynch/simple-feature-detector
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.SimpleFeatureDetector = factory();
  }
}(this, function(require, exports, module) {

return new function () {
    var _featureDetector = this,

        _vendorPrefixes = {
            g: 'moz', //Gecko
            k: 'k', //KHTML (Konqueror)
            p: 'o', //Presto (Opera)
            t: 'ms', //Trident (IE)
            w: 'webkit'
        },

        /**
         * Takes a string container an initial for each vendor would be acceptable and returns a list of their vendor prefixes
         *
         * See this.vendorPrefixes for possible values. "all" is also supported
         *
         * @param prefixes | a string; e.g. "wgt" which means Webkit, Gecko (Moz) or a Trident (MS) prefixed property is ok
         * @returns {Array}
         */
        _buildListOfAcceptableVendorPrefixes = function (prefixes) {
            var vendors = [];
            prefixes = ('all' === prefixes ? 'gkptw' : prefixes);

            for (var c = 0, length = prefixes.length; c < length; c++) {
                vendors.push(_vendorPrefixes[prefixes[c]]);
            }

            return vendors;
        },

        /**
         * A fallback (not polyfill) for Element.CLassList
         * @param element
         */
        _classHandler = new function (element) {
            var _classListIsSupported = undefined !== window.Element && 'classList' in document.documentElement,
                _classProperty = 'class' + (_classListIsSupported ? 'List' : 'Name');

            /**
             * @param className string
             */
            this.add = function (className) {

                /** @var classes string|DOMTokenList */
                var classes = element[_classProperty];

                if (_classListIsSupported) {

                    classes.add(className);
                }
                else {
                    classes += (classes ? ' ' : '' ) + className;
                }

                element[_classProperty] = classes;//sync
            };
        }(document.documentElement),

        /**
         * @param str string
         * @returns string
         */
        _convertHyphenatedToCamelCase = function (str) {
            return str.replace(/-([a-z])/g, function (matches) {
                return matches[1].toUpperCase();
            });
        },

        /**
         * @param property string
         * @returns {boolean}
         */
        _propertyExists = function (property) {

            return undefined !== _featureDetector._getElementStyle(_testElement)[property];
        },


        /**
         * Checks support for a group of properties
         * Takes a one-dimensional object where the keys are the desired properties and their corresponding values are the
         * acceptable vendors to check for (a string like "wp", see _buildListOfAcceptableVendorPrefixes)
         *
         * @param properties array
         * @param declareSupport {boolean}
         * @returns {boolean}
         */
        _supportsAll = function (properties, declareSupport) {
            var supportsAll = true;

            for (var p = 0; p < properties.length; p++) {

                if (!_supportsProperty(properties[p], declareSupport)) {
                    supportsAll = false;

                    //if there was a failure and we're not adding classes, stop
                    if (!declareSupport && !supportsAll) {
                        break;
                    }
                }
            }

            return supportsAll;
        },


        _supportPrefix = 'has-',

        /**
         * Takes an object like {property: 'columnWidth', vendors: 'w'}
         *
         * @param args (Object) | args.vendors is optional
         * @param declareSupport {boolean}
         * @returns {boolean}
         */
        _supportsProperty = function (args, declareSupport) {
            if (undefined !== args.property) {

                var cssProperty = args.property,
                    property = _convertHyphenatedToCamelCase(cssProperty),
                    vendors = args.vendors || '',
                    supported = false;

                if (_propertyExists(property)) {
                    supported = true;
                }
                else {
                    var prefixedPropertyEnd = property[0].toUpperCase() + property.substr(1),
                        prefixes = _buildListOfAcceptableVendorPrefixes(vendors);

                    for (var p = 0; p < prefixes.length; p++) {
                        if (_propertyExists(prefixes[p] + prefixedPropertyEnd)) {
                            supported = true;

                            if (declareSupport) {
                                break;
                            }
                        }
                    }
                }
            }

            if (supported && declareSupport) {
                _classHandler.add(_supportPrefix + cssProperty);
            }

            return supported;
        },

        _testElement;

    /**
     * Added (publicly) to allow for mocking of actual CSSStyleDeclaration interaction in tests
     *
     * @param element
     * @returns {CSSStyleDeclaration}
     */
    this._getElementStyle = function (element) {
        return element.style;
    };

    /**
     * The entry point. Pass it an object like {property: 'columnWidth', vendors: 'w'} and it will return true
     * if column-width / -webkit-column-width / -moz-column-width is supported.
     * Or pass it an array of objects like the one above.
     *
     * @param schrodingersCat | mixed
     * @param declareSupport | {boolean} (defaults to true)
     * @returns {boolean}
     */
    this.supports = function (schrodingersCat, declareSupport) {
        if (undefined === declareSupport) {
            declareSupport = true;
        }

        _testElement = document.createElement('div');

        var functionName = '_supports' + ( schrodingersCat instanceof Array ? 'All' : 'Property');

        return eval(functionName)(schrodingersCat, declareSupport);
    };
};

}));

},{}]},{},[1])