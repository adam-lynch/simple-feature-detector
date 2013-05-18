/**
 * Bootstraps the test environment
 * I.e. globally mocks stuff
 *
 * @author adam-lynch
 */

/**
 * Overrides define to store the feature detector object globally, instead of having the tests depend on RequireJS, etc
 * Does not call it (which instantiates the module)... must call SimpleFeatureDetector() in tests
 *
 * @param module
 */
define = function(module){
	SimpleFeatureDetector = module;
};