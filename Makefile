MOCHA=./node_modules/mocha/bin/mocha
REPORTER=dot

test: test-unit

test-all: test-unit test-integration

test-unit:
		$(MOCHA) --reporter $(REPORTER)

test-integration:
		$(MOCHA) test/integration/*.js --timeout 60s --reporter $(REPORTER) --bail

.PHONY: test test-unit test-integration test-all