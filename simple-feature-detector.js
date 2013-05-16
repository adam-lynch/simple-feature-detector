/**
 * simple-feature-detector v0.01
 * Homepage: https://github.com/adam-lynch/simple-feature-detector
 *
 * @author: adam-lynch
 */
define( function(){
	return new function(){
		var _featureDetector = this,

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

				for( var c = 0, length = ('all' === prefixes ? 'gkpw' : prefixes).length; c < length; c++ ){
					vendors.push( '-' + _vendorPrefixes[prefixes[c]] + '-' );
				}

				return vendors;
			},

			_propertyExists = function( property ){
				return 'undefined' !== _testElement.style[property];
			},

			_testElement = document.createElement( 'div' ),

			_vendorPrefixes = {
				g: 'moz', //Gecko
				k: 'k', //KHTML (Konqueror)
				p: 'o', //Presto (Opera)
				t: 'ms', //Trident (IE)
				w: 'webkit'
			},

			_convertHyphenatedToCamelCase = function( str ){
				return str.replace( /-([a-z])/g, function( matches ){
					return matches[1].toUpperCase();
				} );
			};

		/**
		 * Takes array of objects like
		 *
		 * @param propertiesToDeclareSupportFor
		 * @return {boolean}
		 */
		this.declareSupportFor = function( propertiesToDeclareSupportFor ){
			var bodyClasses = document.body.classList,
				supportPrefix = 'has-',
				propertyDetails,
				supportsAll = true;

			for( var p in propertiesToDeclareSupportFor ){

				propertyDetails = propertiesToDeclareSupportFor[p];

				if( _featureDetector.supportsProperty( propertyDetails ) ){
					bodyClasses.add( supportPrefix + propertyDetails.property );
				}
				else{
					supportsAll = false;
				}
			}
			return supportsAll;
		}

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

			for( var property in properties ){

				if( !_featureDetector.supportsProperty( property ) ){
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
					prefixes = args.prefixes || '';

				if( _propertyExists( property ) ){
					return true;
				}
				else{
					var prefixedPropertyEnd = property[0].toLowerCase() + property.substr( 1 );

					for( var prefix in _buildListOfAcceptableVendorPrefixes( prefixes ) ){
						if( _propertyExists( prefix + prefixedPropertyEnd ) ){
							return true;
						}
					}
				}
			}

			return false;
		};
	};
} );
