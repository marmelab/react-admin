.PHONY: build help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@npm install

run: example_install ## run the example
	@cd example && ../node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

example_install: example/package.json
	@cd example && npm install

build: ## compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'
	@cd src && rsync -R `find . -name *.css` ../lib # copy all CSS files keeping structure from src to lib

watch: ## continuously compile ES6 files to JS
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js' --watch

doc: ## compile doc as html and launch doc web server
	@cd docs && jekyll server . --watch

test: ## launch unit tests
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		'./src/**/*.spec.js'

test-watch: ## launch unit tests and watch for changes
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		--watch \
		'./src/**/*.spec.js'
