<?php
/**
 * Helpers to parse the config file
 *
 * @author adam-lynch
 */

require_once( 'directory.php' );

function parseConfig( $filename, &$errors ) {

	$filenames = array();

	$configContents = file_get_contents( $filename );
	if ( empty( $configContents ) ) {
		$errors[] = "Couldn't get contents of config file";
	}
	else {

		//read in & interpret the config file
		$parsed = new \SimpleXMLElement( $configContents );

		//if the parsing failed or the required 'load' element doesn't exit
		if ( empty( $parsed ) ) {
			$errors[] = 'Problem parsing XML in config file';
		}
		else {

			foreach ( $parsed->load as $load ) {
				$path = (string) $load['location'];

				if ( preg_match( '%^.+?[^*]\.[a-zA-Z0-9]+$%', $path, $filePathMatches ) ) { //e.g. ends with .js but not *.js
					$filenames[] = $filePathMatches[0]; //add path to include list
				}
				else { //e.g. path ends with *.js

					$files = readDirectory( $path, $errors );

					//if readDirectory added to $errors global
					if ( count( $errors ) ) {
						break;
					}

					//add paths to include list:
					$filenames = array_merge( $filenames, $files );
				}
			}
		}
	}

	return $filenames;
}