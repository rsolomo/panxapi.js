NODE=node
MOCHA=./node_modules/mocha/bin/mocha
REPORTER=dot

test: test-unit

test-all: test-unit test-acceptance

test-unit:
		$(MOCHA) --reporter $(REPORTER)

test-acceptance:
		$(NODE) ./test/acceptance/test.js

.PHONY: test test-unit test-integration test-all