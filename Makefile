.PHONY: build help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@npm install
	@./node_modules/.bin/selenium-standalone install --version=2.50.1 --drivers.chrome.version=2.21
	@./node_modules/.bin/webdriver-manager update --standalone=0

run: example_install ## run the example
	@cd example && ../node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

example_install: example/package.json
	@cd example && npm install

build: ## compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'

watch: ## continuously compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js' --watch

doc: ## compile doc as html and launch doc web server
	@cd docs && jekyll server . --watch

test: test-unit test-e2e ## launch all tests

test-unit: ## launch unit tests
	@NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		'./src/**/*.spec.js'

test-unit-watch: ## launch unit tests and watch for changes
	@NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		--watch \
		'./src/**/*.spec.js'

test-e2e: ## launch end-to-end tests. call make test-e2e skip-build to skip the build
	@if [ "$(filter-out $@,$(MAKECMDGOALS))" != "skip-build" ]; then \
		echo 'Building example code...'; \
		NODE_ENV=production cd example && ../node_modules/.bin/webpack; \
	fi
	@echo 'Launching e2e tests...'
	@NODE_ENV=test node_modules/.bin/mocha \
		--require co-mocha \
		--timeout 10000 \
		./e2e/tests/server.js \
		./e2e/tests/*.js
