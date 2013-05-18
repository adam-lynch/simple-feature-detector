var allTests = function( supportForClassList ){

	if('undefined' === typeof supportForClassList){
		supportForClassList = true;//true by default
	}

	if( supportForClassList && ('undefined' === typeof Element || ! 'classList' in document.documentElement)){
		console.error("Since your browser does not support Element.classList, half of the tests are meaningless");
	}

	var instantiateSimpleFeatureDetector = function(){

		var featureDetector = SimpleFeatureDetector();


		featureDetector._classListIsSupported = supportForClassList;

		return featureDetector;
	}

	afterEach( function(){
		testUtils.cleanFeatureClasses( document.documentElement );
	} );

	//------------------------------------------------------------------------------------------------------------------


	it( "exists", function(){
		expect( typeof SimpleFeatureDetector ).not.toEqual( "undefined" );
		expect( typeof SimpleFeatureDetector() ).toEqual( "object" );
		expect( typeof instantiateSimpleFeatureDetector() ).toEqual( "object" );
	} );


	//------------------------------------------------------------------------------------------------------------------

	describe( "declares support for features", function(){

		it( "declares support whether it be found natively or with a the current rendering engine's vendor prefix",
			function(){

				var simpleFeatureDetector = instantiateSimpleFeatureDetector(),
					expectedLocation = document.documentElement;

				testUtils.mockStylesSupport( simpleFeatureDetector, {
					columnWidth:      "11px",
					mozColumnGapSize: "infinity",
					webkitBlah:       "none"
				} );

				var desiredProperties = [
						{
							property: 'column-width',
							vendors:  ''//native
						},
						{
							property: 'column-gap-size',
							vendors:  'all'//gecko
						},
						{
							property: 'blah',
							vendors:  'w'//ebkit
						}
					],
					result = simpleFeatureDetector.declareSupportFor( desiredProperties );

				expect( result ).toEqual( true );

				var classes = expectedLocation.className.split( " " ),
					expectedClass,
					found,
					index

				for( var d in desiredProperties ){
					expectedClass = testUtils.featureClassPrefix + desiredProperties[d].property;
					found = false;

					for( index in classes ){
						if( classes[index] === expectedClass ){
							classes.splice( index, 1 );//remove from array

							found = true;
							break;
						}
					}

					expect( found ).toEqual( true );
				}

			} );
	} );


	//------------------------------------------------------------------------------------------------------------------


	var groupOfDesiredProperties = {
		'column-width':                       'columnWidth',
		'border-radius':                      'borderRadius',
		'this-does-not-have-to-really-exist': 'thisDoesNotHaveToReallyExist'
	};

	describe( "detects groups of features", function(){

		/**
		 * Convenience function to run a "group" test
		 *
		 * @param vendors []
		 * @param successExpected {boolean}
		 */
		var buildListsOfPropertiesAndTest = function( simpleFeatureDetector, vendors, vendorStylePropertyPrefix, successExpected ){

			var desiredCSSProperties,
				mockedStyles,
				styleProperty,
				prefixedStyleProperty;

			for( var cssProperty in groupOfDesiredProperties ){
				mockedStyles = {};
				desiredCSSProperties = [];

				desiredCSSProperties.push( { property: cssProperty, vendors: vendors } );

				styleProperty = groupOfDesiredProperties[cssProperty];
				prefixedStyleProperty = vendorStylePropertyPrefix
					? vendorStylePropertyPrefix + styleProperty[0].toUpperCase() + styleProperty.slice( 1 )
					: styleProperty;//don't change casing if no prefix was passed

				mockedStyles[prefixedStyleProperty] = "";
			}

			testUtils.mockStylesSupport( simpleFeatureDetector, mockedStyles );

			expect( simpleFeatureDetector.supports( desiredCSSProperties ) ).toEqual( successExpected );
		};

		it( "correctly detects native-support for a group of CSS properties", function(){

			var simpleFeatureDetector = instantiateSimpleFeatureDetector(),
				vendorStylePropertyPrefix = '';

			buildListsOfPropertiesAndTest( simpleFeatureDetector, "", vendorStylePropertyPrefix, true );
			//just to be sure, nothing changes when all vendors are selected:
			buildListsOfPropertiesAndTest( simpleFeatureDetector, "all", vendorStylePropertyPrefix, true );
		} );

		var vendor;
		for( var v in testUtils.vendors ){
			vendor = testUtils.vendors[v];

			it( "correctly detects support for a group of vendor-prefixed CSS properties - " + vendor.description,
				function( vendor ){
					return function(){

						var simpleFeatureDetector = instantiateSimpleFeatureDetector(),
							vendorStylePropertyPrefix = vendor.stylePropertyPrefix;

						//should not be true when no vendors are specified:
						buildListsOfPropertiesAndTest( simpleFeatureDetector, "", vendorStylePropertyPrefix, false );

						//should be true if the correct vendor is specified:
						buildListsOfPropertiesAndTest( simpleFeatureDetector, vendor.initial, vendorStylePropertyPrefix,
													   true );

						//just to be sure, nothing changes when all vendors are selected:
						buildListsOfPropertiesAndTest( simpleFeatureDetector, "all", vendorStylePropertyPrefix, true );
					};
				}( vendor ) );
		}
	} );


	//------------------------------------------------------------------------------------------------------------------


	describe( "individually detects feature", function(){

		/**
		 * Just for convenience; will test if the cssProperty is supported (based on the styleProperty, i.e. support,
		 * you give). Set shouldFailWithNoVendors to true if you expect a "native" test to fail. If there's a specific
		 * vendor(s) you need to test for success against, set vendorsItShouldPassWith
		 *
		 * @param simpleFeatureDetector {SimpleFeatureDetector}
		 * @param vendors string
		 * @param successExpected {boolean}
		 */
		var individualPropertyTest = function( simpleFeatureDetector, cssProperty, styleProperty, shouldFailWithNoVendors, vendorsItShouldPassWith ){
			/**
			 * Just for convenience
			 *
			 * @param simpleFeatureDetector {SimpleFeatureDetector}
			 * @param cssProperty string
			 * @param vendors string
			 * @param successExpected {boolean}
			 */
			var minimalIndividualTest = function( simpleFeatureDetector, cssProperty, vendors, successExpected ){
					expect( simpleFeatureDetector.supports( {property: cssProperty, vendors: vendors} ) )
						.toEqual( successExpected );
				},
				mockedStyles = {};
			mockedStyles[styleProperty] = "";
			testUtils.mockStylesSupport( simpleFeatureDetector, mockedStyles );


			minimalIndividualTest( simpleFeatureDetector, cssProperty, "", !shouldFailWithNoVendors );

			if( vendorsItShouldPassWith ){
				minimalIndividualTest( simpleFeatureDetector, cssProperty, vendorsItShouldPassWith, true );
			}

			//just to be sure, nothing changes when all vendors are selected:
			minimalIndividualTest( simpleFeatureDetector, cssProperty, "all", true );
		};

		for( var cssProperty in groupOfDesiredProperties ){

			var styleProperty = groupOfDesiredProperties[cssProperty],
				stylePropertyWhenPrefixed = styleProperty[0].toUpperCase() + styleProperty.slice( 1 ),
				prefixedStyleProperty,
				vendor;

			it( "correctly detects native-support for a CSS property (" + cssProperty + ")", function(){

				individualPropertyTest( instantiateSimpleFeatureDetector(), cssProperty, styleProperty );
			} );

			for( var v in testUtils.vendors ){
				vendor = testUtils.vendors[v];
				prefixedStyleProperty = vendor.stylePropertyPrefix + stylePropertyWhenPrefixed;

				it( "correctly detects support for a vendor-prefixed CSS property (" + cssProperty + ") - "
						+ vendor.description,
					function( vendor, prefixedStyleProperty, cssProperty ){
						return function(){

							individualPropertyTest( instantiateSimpleFeatureDetector(), cssProperty, prefixedStyleProperty, true,
													vendor.initial );
						};
					}( vendor, prefixedStyleProperty, cssProperty ) );
			}
		}
	} );

};

describe( "Simple Feature Detector", function(){

	describe( "with Element.ClassList support", allTests );

	describe( "using a Element.className as a fallback for Element.ClassList", function(){
		allTests(false);
	} );
} );