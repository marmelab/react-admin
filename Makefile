.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@yarn

run: run-simple

run-simple: ## run the simple example
	@yarn -s run-simple

run-tutorial: ## run the tutorial example
	@yarn -s run-tutorial

run-demo: ## run the demo example
	@yarn -s run-demo

run-demo-watch: ## run the demo example with watch on the ra dependencies
	@yarn -s run-demo-watch

build-demo: ## compile the demo example to static js
	@yarn -s build-demo

run-graphql-demo: ## run the demo example
	@yarn -s run-graphql-demo

run-graphql-demo-watch: ## run the demo example with watch on the ra dependencies
	@yarn -s run-graphql-demo-watch

build-ra-core:
	@echo "Transpiling ra-core files...";
	@cd ./packages/ra-core && yarn -s build

build-ra-ui-materialui:
	@echo "Transpiling ra-ui-materialui files...";
	@cd ./packages/ra-ui-materialui && yarn -s build

build-react-admin:
	@echo "Transpiling react-admin files...";
	@rm -rf ./packages/react-admin/docs
	@cd ./packages/react-admin && yarn -s build
	@mkdir packages/react-admin/docs
	@cp docs/*.md packages/react-admin/docs

build-ra-data-fakerest:
	@echo "Transpiling ra-data-fakerest files...";
	@cd ./packages/ra-data-fakerest && yarn -s build

build-ra-data-json-server:
	@echo "Transpiling ra-data-json-server files...";
	@cd ./packages/ra-data-json-server && yarn -s build

build-ra-data-simple-rest:
	@echo "Transpiling ra-data-simple-rest files...";
	@cd ./packages/ra-data-simple-rest && yarn -s build

build-ra-data-graphql:
	@echo "Transpiling ra-data-graphql files...";
	@cd ./packages/ra-data-graphql && yarn -s build

build-ra-data-graphcool:
	@echo "Transpiling ra-data-graphcool files...";
	@cd ./packages/ra-data-graphcool && yarn -s build

build-ra-data-graphql-simple:
	@echo "Transpiling ra-data-graphql-simple files...";
	@cd ./packages/ra-data-graphql-simple && yarn -s build

build-ra-i18n-polyglot:
	@echo "Transpiling ra-i18n-polyglot files...";
	@cd ./packages/ra-i18n-polyglot && yarn -s build

build-ra-input-rich-text:
	@echo "Transpiling ra-input-rich-text files...";
	@cd ./packages/ra-input-rich-text && yarn -s build

build-data-generator:
	@echo "Transpiling data-generator files...";
	@cd ./examples/data-generator && yarn -s build

build: build-ra-core build-ra-ui-materialui build-ra-data-fakerest build-ra-data-json-server build-ra-data-simple-rest build-ra-data-graphql build-ra-data-graphcool build-ra-data-graphql-simple build-ra-i18n-polyglot build-ra-input-rich-text build-data-generator build-react-admin  ## compile ES6 files to JS

doc: ## compile doc as html and launch doc web server
	@yarn -s doc

serve-github-pages: ## Serve the doc from a Github Pages docker container
	@docker run -it --rm \
		-p 4000:4000 \
		-v "${PWD}/docs:/usr/src/app" \
		starefossen/github-pages:onbuild \
		jekyll serve \
			--host=0.0.0.0 \
			--incremental

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@yarn -s lint

prettier: ## prettify the source code using prettier
	@echo "Running prettier..."
	@yarn -s prettier

test: build test-unit lint test-e2e ## launch all tests

test-unit: ## launch unit tests
	@if [ "$(CI)" != "true" ]; then \
		echo "Running unit tests..."; \
		yarn -s test-unit; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Running unit tests in CI..."; \
		yarn -s test-unit-ci; \
	fi

test-unit-watch: ## launch unit tests and watch for changes
	echo "Running unit tests..."; \
	yarn -s test-unit --watch; \

test-e2e: ## launch end-to-end tests
	@if [ "$(build)" != "false" ]; then \
		echo 'Building example code (call "make build=false test-e2e" to skip the build)...'; \
		cd examples/simple && BABEL_ENV=cjs yarn -s build; \
	fi

	@NODE_ENV=test cd cypress && yarn -s test


test-e2e-local: ## launch end-to-end tests for development
	@echo 'Starting e2e tests environment. Ensure you started the simple example first (make run-simple)'
	@cd cypress && yarn -s start
