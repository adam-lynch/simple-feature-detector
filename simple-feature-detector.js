/**
 * simple-feature-detector v0.01
 * Homepage: https://github.com/adam-lynch/simple-feature-detector
 *
 * @author: adam-lynch
 */
define( function(){
	return new function(){
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
				_buildListOfAcceptableVendorPrefixes = function( prefixes ){
				var vendors = [];
				prefixes = ('all' === prefixes ? 'gkptw' : prefixes);

				for( var c = 0, length = prefixes.length; c < length; c++ ){
					vendors.push( _vendorPrefixes[prefixes[c]] );
				}

				return vendors;
			},

			_classListIsSupported = 'undefined' !== typeof Element && 'classList' in document.documentElement,

			/**
			 * A fallback (not polyfill) for Element.CLassList
			 * @param element
			 */
			_ClassHandler = function( element ){
				var _classProperty = 'class' + (_classListIsSupported ? 'List' : 'Name');

				/**
				 * @param className string
				 */
				this.add = function( className ){

					/** @var classes string|DOMTokenList */
					var classes = element[_classProperty];

					if( _classListIsSupported ){

						classes.add( className );
					}
					else{
						classes += (classes ? ' ' : '' ) + className;
					}

					element[_classProperty] = classes;//sync
				};
			},

			_convertHyphenatedToCamelCase = function( str ){
				return str.replace( /-([a-z])/g, function( matches ){
					return matches[1].toUpperCase();
				} );
			},

			/**
			 * @param property string
			 */
				_propertyExists = function( property ){

				return 'undefined' !== typeof _featureDetector._getElementStyle( _testElement )[property];
			},

			_testElement = document.createElement( 'div' );

		/**
		 * Takes array of objects like
		 *
		 * @param propertiesToDeclareSupportFor
		 * @return {boolean}
		 */
		this.declareSupportFor = function( propertiesToDeclareSupportFor ){

			var classHandler = new _ClassHandler( document.documentElement ),
				supportPrefix = 'has-',
				supportsAll = true,
				propertyDetails;

			for( var p in propertiesToDeclareSupportFor ){

				propertyDetails = propertiesToDeclareSupportFor[p];

				if( _featureDetector.supportsProperty( propertyDetails ) ){

					classHandler.add( supportPrefix + propertyDetails.property );
				}
				else{
					supportsAll = false;
				}
			}

			return supportsAll;
		};

		/**
		 * Added (publicly) to allow for mocking of actual CSSStyleDeclaration interaction in tests
		 *
		 * @param element
		 * @returns {CSSStyleDeclaration}
		 */
		this._getElementStyle = function( element ){
			return element.style;
		};

		/**
		 * Most likely entry point. Pass it an object like {property: 'columnWidth', vendors: 'w'} and it will return true
		 * if column-width / -webkit-column-width / -moz-column-width is supported.
		 * Or pass it an array of objects like the one above.
		 *
		 * @param schrodingersCat | mixed
		 * @returns {boolean}
		 */
		this.supports = function( schrodingersCat ){
			return this['supports' + ( schrodingersCat instanceof Array ? 'All' : 'Property')]( schrodingersCat );
		};

		/**
		 * Checks support for a group of properties
		 * Takes a one-dimensional object where the keys are the desired properties and their corresponding values are the
		 * acceptable vendors to check for (a string like "wp", see _buildListOfAcceptableVendorPrefixes)
		 *
		 * @param properties
		 * @returns {boolean}
		 */
		this.supportsAll = function( properties ){

			for( var p in properties ){

				if( !_featureDetector.supportsProperty( properties[p] ) ){
					return false;
				}
			}

			return true;
		};

		/**
		 * Takes an object like {property: 'columnWidth', vendors: 'w'}
		 *
		 * @param args (Object) | args.vendors is optional
		 * @returns {boolean}
		 */
		this.supportsProperty = function( args ){
			if( 'undefined' !== typeof args.property ){

				var property = _convertHyphenatedToCamelCase( args.property ),
					vendors = args.vendors || '';

				if( _propertyExists( property ) ){
					return true;
				}
				else{
					var prefixedPropertyEnd = property[0].toUpperCase() + property.substr( 1 ),
						prefixes = _buildListOfAcceptableVendorPrefixes( vendors );

					for( var p in prefixes ){
						if( _propertyExists( prefixes[p] + prefixedPropertyEnd ) ){
							return true;
						}
					}
				}
			}

			return false;
		};
	};
} );
