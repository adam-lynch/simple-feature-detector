var testUtils = new function(){
	var _testUtils = this;

	this.featureClassPrefix = 'has-';

	/**
	 * Removes classes added by the detector
	 * (just assumes any with the prefix "has-" is one)
	 *
	 * @param element
	 */
	this.cleanFeatureClasses = function( element ){
		var classes = element.className.split( " " ),
			irrelevantClasses = [],
			className;

		for( var c in classes ){
			className = classes[c];

			if( 0 !== classes[c].indexOf( _testUtils.featureClassPrefix ) ){
				irrelevantClasses.push( className );
			}
		}

		element.className = irrelevantClasses.join( " " );
	};

	/**
	 * Mocks support for features by setting a default for them in the style obj
	 *
	 * @param simpleFeatureDetector {SimpleFeatureDetector}
	 * @param styleProperties {}
	 */
	this.mockStylesSupport = function( simpleFeatureDetector, styleProperties ){
		simpleFeatureDetector._getElementStyle = function( element ){
			return styleProperties;
		};
	};

	this.vendors = [
		{
			initial:             'g',
			stylePropertyPrefix: 'moz',
			description:         'Gecko (Mozilla / Firefox)'
		},
		{
			initial:             'k',
			stylePropertyPrefix: 'k',
			description:         'KHTML (Konqueror)'
		},
		{
			initial:             'p',
			stylePropertyPrefix: 'o',
			description:         'Presto (Opera)'
		},
		{
			initial:             't',
			stylePropertyPrefix: 'ms',
			description:         'Trident (IE)'
		},
		{
			initial:             'w',
			stylePropertyPrefix: 'webkit',
			description:         'WebKit'
		}
	];
}();