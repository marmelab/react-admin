.PHONY: example

example:
	./node_modules/.bin/webpack-dev-server --config ./example/webpack.config.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register './src/**/*.spec.js'
