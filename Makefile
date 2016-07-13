.PHONY: example

install:
	@npm install

example:
	@cd example && ../node_modules/.bin/webpack-dev-server --config ./webpack.config.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register './src/**/*.spec.js'
