.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@yarn

run: ## run the example
	@cd packages/ra-example && ./node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

build-react-admin:
	@rm -rf ./packages/react-admin/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/react-admin/src -d ./packages/react-admin/lib --ignore '*.spec.js'

build-ra-data-json-server:
	@rm -rf ./packages/ra-data-json-server/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-json-server/src -d ./packages/ra-data-json-server/lib --ignore '*.spec.js'

build-ra-data-simple-rest:
	@rm -rf ./packages/ra-data-simple-rest/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-simple-rest/src -d ./packages/ra-data-simple-rest/lib --ignore '*.spec.js'

build-ra-input-rich-text:
	@rm -rf ./packages/ra-input-rich-text/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-input-rich-text/src -d ./packages/ra-input-rich-text/lib --ignore '*.spec.js'
	@cd packages/ra-input-rich-text/src && rsync -R `find . -name *.css` ../lib

build: build-react-admin build-ra-data-json-server build-ra-data-simple-rest build-ra-input-rich-text ## compile ES6 files to JS

watch: ## continuously compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js' --watch

doc: ## compile doc as html and launch doc web server
	@cd docs && jekyll server . --watch

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@./node_modules/.bin/eslint ./packages/react-admin/src/

prettier: ## prettify the source code using prettier
	@./node_modules/.bin/prettier-eslint --write --list-different  "packages/react-admin/src/**/*.js" "packages/ra-example/**/*.js"

test: test-unit lint test-e2e ## launch all tests

test-unit: ## launch unit tests
	@echo "Running unit tests..."
	@NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/jest

test-unit-watch: ## launch unit tests and watch for changes
	@NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/jest --watch

test-e2e: ## launch end-to-end tests
	@if [ "$(build)" != "false" ]; then \
		echo 'Building example code (call "make build=false test-e2e" to skip the build)...'; \
		cd packages/ra-example && ./node_modules/.bin/webpack; \
	fi
	@NODE_ENV=test node_modules/.bin/mocha \
		--compilers js:babel-register \
		--timeout 15000 \
		./e2e/tests/server.js \
		./e2e/tests/*.js
