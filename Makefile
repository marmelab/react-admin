.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@yarn

run: run-simple

run-simple: ## run the simple example
	@cd examples/simple && ./node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

run-tutorial: build ## run the tutorial example
	@cd examples/tutorial && yarn start

run-demo: build ## run the demo example
	@cd examples/demo && REACT_APP_DATA_PROVIDER=rest yarn start

run-graphql-demo: build ## run the demo example
	@cd examples/demo && REACT_APP_DATA_PROVIDER=graphql yarn start

run-graphcool-demo: build ## run the demo example
	@cd examples/graphcool-demo && yarn start

build-react-admin:
	@rm -rf ./packages/react-admin/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/react-admin/src -d ./packages/react-admin/lib --ignore spec.js,test.js

build-ra-data-json-server:
	@rm -rf ./packages/ra-data-json-server/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-json-server/src -d ./packages/ra-data-json-server/lib --ignore spec.js,test.js

build-ra-data-simple-rest:
	@rm -rf ./packages/ra-data-simple-rest/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-simple-rest/src -d ./packages/ra-data-simple-rest/lib --ignore spec.js,test.js

build-ra-input-rich-text:
	@rm -rf ./packages/ra-input-rich-text/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-input-rich-text/src -d ./packages/ra-input-rich-text/lib --ignore spec.js,test.js
	@cd packages/ra-input-rich-text/src && rsync -R `find . -name *.css` ../lib

build-ra-data-graphql:
	@rm -rf ./packages/ra-data-graphql/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-graphql/src -d ./packages/ra-data-graphql/lib --ignore spec.js,test.js

build-ra-data-graphcool:
	@rm -rf ./packages/ra-data-graphcool/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-graphcool/src -d ./packages/ra-data-graphcool/lib --ignore spec.js,test.js

build-ra-data-graphql-simple:
	@rm -rf ./packages/ra-data-graphql-simple/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-data-graphql-simple/src -d ./packages/ra-data-graphql-simple/lib --ignore spec.js,test.js

build-ra-dependent-input:
	@rm -rf ./packages/ra-dependent-input/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./packages/ra-dependent-input/src -d ./packages/ra-dependent-input/lib --ignore spec.js,test.js

build-data-generator:
	@rm -rf ./examples/data-generator/lib
	@NODE_ENV=production ./node_modules/.bin/babel ./examples/data-generator/src -d ./examples/data-generator/lib

build: build-react-admin build-ra-data-json-server build-ra-data-simple-rest build-ra-input-rich-text build-ra-data-graphql build-ra-data-graphcool build-ra-dependent-input build-ra-data-graphql-simple build-data-generator ## compile ES6 files to JS

watch: ## continuously compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore spec.js,test.js --watch

doc: ## compile doc as html and launch doc web server
	@cd docs && jekyll server . --watch

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@"./node_modules/.bin/eslint" ./packages/react-admin/src/

prettier: ## prettify the source code using prettier
	@./node_modules/.bin/prettier-eslint --write --list-different  "packages/react-admin/src/**/*.js" "examples/**/*.js"

test: build test-unit lint test-e2e ## launch all tests

test-unit: ## launch unit tests
	@if [ "$(CI)" != "true" ]; then \
		echo "Running unit tests..."; \
		NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/jest; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Running unit tests in CI..."; \
		NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/jest --runInBand; \
	fi

test-unit-watch: ## launch unit tests and watch for changes
	@NODE_ENV=test NODE_ICU_DATA=node_modules/full-icu ./node_modules/.bin/jest --watch

test-e2e: ## launch end-to-end tests
	@if [ "$(build)" != "false" ]; then \
		echo 'Building example code (call "make build=false test-e2e" to skip the build)...'; \
		cd examples/simple && ./node_modules/.bin/webpack; \
	fi
	@NODE_ENV=test node_modules/.bin/mocha \
		--require babel-core/register \
		--timeout 15000 \
		./e2e/tests/server.js \
		./e2e/tests/*.js
