.PHONY: example

install:
	@npm install

run:
	@cd example && ../node_modules/.bin/webpack-dev-server --hot --inline --config ./webpack.config.js

build:
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'

doc:
	@cd docs && jekyll server . --watch --future

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		'./src/**/*.spec.js'

test-watch:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ignore-styles \
		--compilers js:babel-register \
		--watch \
		'./src/**/*.spec.js'
