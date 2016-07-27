.PHONY: example

install:
	@npm install

example:
	@cd example && ../node_modules/.bin/webpack-dev-server --config ./webpack.config.js

build:
	@BABEL_ENV=cjs ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'
	@BABEL_ENV=es ./node_modules/.bin/babel ./src -d es6 --ignore '*.spec.js'

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register './src/**/*.spec.js'
