Testing built upon [phantomjs-jasminexml-example](https://github.com/adam-lynch/phantomjs-jasminexml-example).

### Running the tests

- You can simply open `test-runner.html` in your browser
- If you have [phantomjs](https://github.com/ariya/phantomjs) installed, you can run the following command: ` phantomjs ./test/config/phantomjs_jasminexml_runner.js ./test/test-runner.html ./test/results`

### Modifying tests
If you edit a test file (a JavaScript file here in this directory), you don't have to do anything before running the tests. 

If you add / remove /rename a test file, you need to regenerate the HTML test runner. You need PHP for this. Simply run `php ./test/writeTestRunnerFile.php`.
By default, any JavaScript files in this directory at the time the test runner is generated will be loaded in the test runner.

The files which are to loaded in the test runner are defined in `config/config.xml`.
Wildcards are supported.