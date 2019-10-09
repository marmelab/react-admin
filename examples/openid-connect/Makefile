.PHONY: build

install:
	cd api && yarn install
	cd app && yarn install

run-app:
	cd app && yarn start

run-api:
	cd api && yarn start

build:
	rm -rf ./docs
	cd app && NODE_ENV=production yarn build
	mv app/build docs
