<?php

/**
 * @param string $filename
 * @param array  $errors
 * @param array  $scriptsToLoad
 *
 * @author adam-lynch
 */
function writeHTMLRunner( $filename, array $errors, array $scriptsToLoad ) {

	$errorCount = count( $errors );
	$htmlString = '<!DOCTYPE html>
                        <html>
                            <head>
                                <title>Tests</title>
                                <meta charset="UTF-8"/>
                                <link rel="stylesheet" type="text/css" href="config/jasmine/jasmine.css"/>
                            </head>
                        <body>';

//output errors if any occurred
	if ( $errorCount ) {
		$htmlString .= "<ul>";

		foreach ( $errors as $error ) {
			$htmlString .= "<li>{$error}</li>";
		}

		$htmlString .= "</ul>";
	}
	else {

		$scriptsToLoad = str_replace( '\\', '\\\\', "'" . implode( "', '", $scriptsToLoad ) . "'" ); //escape backslashes

		//run tests if there wasn't any errors

		$htmlString .= '<script src="config/head.min.js"></script>
            <script type="text/javascript">
                head.js('

					   . $scriptsToLoad //include scripts specified in config file

					   . ', function(){
                    jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
                    jasmine.getEnv().addReporter(new jasmine.PhantomJSReporter());
                    jasmine.getEnv().execute();
                });
            </script>';
	}

	$htmlString .= '</body>
                        </html>';

	file_put_contents( $filename, $htmlString );
}