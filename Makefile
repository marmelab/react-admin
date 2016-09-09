.PHONY: example

install:
	@npm install

example:
	@cd example && ../node_modules/.bin/webpack-dev-server --config ./webpack.config.js

watch:
	./node_modules/.bin/babel ./src -w -d lib --ignore '*.spec.js'

build:
	@NODE_ENV=production ./node_modules/.bin/babel ./src -d lib --ignore '*.spec.js'

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register './src/**/*.spec.js'
