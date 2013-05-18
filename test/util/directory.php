<?php
/**
 * Goes to the path given and returns a list of appropriate files
 *
 * @author adam-lynch
 */
function readDirectory( $path, &$errors ) {

	$files = array();
	$regex = '.*'; //any filename accepted

	//adjust path and regex if wildcards are used
	if ( preg_match( '%^(.+)\*(\.[a-zA-Z0-9]+)?$%', $path, $pathPieces ) ) {
		$path = $pathPieces[1];

		if ( !empty( $pathPieces[2] ) ) {
			$regex = $pathPieces[2] . '$';
		}
	}

	$iterator = new \RegexIterator(
		new \RecursiveIteratorIterator(
			new \RecursiveDirectoryIterator( $path, \FilesystemIterator::SKIP_DOTS ),
			\RecursiveIteratorIterator::LEAVES_ONLY
		),
		'%^.*' . $regex . '%',
		\RecursiveRegexIterator::GET_MATCH
	);

	foreach ( $iterator as $fileMatch ) {
		$files[] = $fileMatch[0];
	}

	return $files;
}