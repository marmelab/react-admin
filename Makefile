.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@npm install

run: example_install ## run the example
	@cd example && ./node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

example_install: example/package.json
	@cd example && npm install

clean:
	@rm -rf lib

build: clean ## compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'

watch: ## continuously compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js' --watch

doc: ## compile doc as html and launch doc web server
	@cd docs && jekyll server . --watch

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@./node_modules/.bin/eslint .

prettier: ## prettify the source code using prettier
	@./node_modules/.bin/prettier-eslint --write --list-different  "src/**/*.js" "example/**/*.js"

test: test-unit lint test-e2e ## launch all tests

test-unit: ## launch unit tests
	@echo "Running unit tests..."
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

test-e2e: ## launch end-to-end tests
	@if [ "$(build)" != "false" ]; then \
		echo 'Building example code (call "make build=false test-e2e" to skip the build)...'; \
		cd example && ./node_modules/.bin/webpack; \
	fi
	@echo 'Launching e2e tests...'
	@NODE_ENV=test node_modules/.bin/mocha \
		--compilers js:babel-register \
		--timeout 15000 \
		./e2e/tests/server.js \
		./e2e/tests/*.js
