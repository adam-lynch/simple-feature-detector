<?php

/**
 * @author adam-lynch
 *
 * WARNING: this file assumes paths are relative to the test runner,
 * i.e. the root test directory
 */

require_once( 'util/config.php' );
require_once( 'util/HTMLRunner.php' );

$errors = array();

$scriptsToLoad = parseConfig( 'config/config.xml', $errors );

writeHTMLRunner( 'test-runner.html', $errors, $scriptsToLoad );
