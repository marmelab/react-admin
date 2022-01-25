.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@if [ "$(CI)" != "true" ]; then \
		echo "Full install..."; \
		yarn; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Frozen install..."; \
		yarn --frozen-lockfile; \
	fi

run: run-simple

run-simple: ## run the simple example
	@yarn run-simple

run-no-code: ## run the no-code example
	@yarn run-no-code

run-tutorial: ## run the tutorial example
	@yarn run-tutorial

run-demo: ## run the ecommerce example
	@yarn run-demo

run-demo-watch: ## run the ecommerce example and watch changes in ra dependencies
	@yarn run-demo-watch

build-demo: ## compile the ecommerce example to static js
	@yarn build-demo

run-graphql-demo: ## run the ecommerce example with a graphql backend
	@yarn run-graphql-demo

run-graphql-demo-watch: ## run the ecommerce example with a graphql backend and watch changes in ra dependencies
	@yarn run-graphql-demo-watch

run-crm: ## run the crm example
	@yarn run-crm

build-crm: ## run the crm example
	@yarn build-crm

build-ra-core:
	@echo "Transpiling ra-core files...";
	@cd ./packages/ra-core && yarn build

build-ra-test:
	@echo "Transpiling ra-test files...";
	@cd ./packages/ra-test && yarn build

build-ra-ui-materialui:
	@echo "Transpiling ra-ui-materialui files...";
	@cd ./packages/ra-ui-materialui && yarn build

build-ra-language-english:
	@echo "Transpiling ra-language-english files...";
	@cd ./packages/ra-language-english && yarn build

build-ra-language-french:
	@echo "Transpiling ra-language-french files...";
	@cd ./packages/ra-language-french && yarn build

build-react-admin:
	@echo "Transpiling react-admin files...";
	@rm -rf ./packages/react-admin/docs
	@cd ./packages/react-admin && yarn build
	@mkdir packages/react-admin/docs
	@cp docs/*.md packages/react-admin/docs

build-ra-data-fakerest:
	@echo "Transpiling ra-data-fakerest files...";
	@cd ./packages/ra-data-fakerest && yarn build

build-ra-data-json-server:
	@echo "Transpiling ra-data-json-server files...";
	@cd ./packages/ra-data-json-server && yarn build

build-ra-data-localstorage:
	@echo "Transpiling ra-data-localstorage files...";
	@cd ./packages/ra-data-localstorage && yarn build

build-ra-data-simple-rest:
	@echo "Transpiling ra-data-simple-rest files...";
	@cd ./packages/ra-data-simple-rest && yarn build

build-ra-data-graphql:
	@echo "Transpiling ra-data-graphql files...";
	@cd ./packages/ra-data-graphql && yarn build

build-ra-data-graphql-simple:
	@echo "Transpiling ra-data-graphql-simple files...";
	@cd ./packages/ra-data-graphql-simple && yarn build

build-ra-i18n-polyglot:
	@echo "Transpiling ra-i18n-polyglot files...";
	@cd ./packages/ra-i18n-polyglot && yarn build

build-ra-input-rich-text:
	@echo "Transpiling ra-input-rich-text files...";
	@cd ./packages/ra-input-rich-text && yarn build

build-ra-no-code:
	@echo "Transpiling ra-no-code files...";
	@cd ./packages/ra-no-code && yarn build

build-data-generator:
	@echo "Transpiling data-generator files...";
	@cd ./examples/data-generator && yarn build

build: build-ra-core build-ra-test build-ra-ui-materialui build-ra-data-fakerest build-ra-data-json-server build-ra-data-localstorage build-ra-data-simple-rest build-ra-data-graphql build-ra-data-graphql-simple build-ra-i18n-polyglot build-ra-input-rich-text build-data-generator build-ra-language-english build-ra-language-french build-react-admin build-ra-no-code  ## compile ES6 files to JS

doc: ## compile doc as html and launch doc web server
	@yarn doc

docker-doc: ## run the doc website in a docker container
	@docker run -it --rm \
		-p 4000:4000 \
		-v="${PWD}/docs:/site" \
		bretfisher/jekyll \
		serve -H 0.0.0.0

serve-github-pages: docker-doc ## Serve the doc from a Github Pages docker container

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@yarn lint

prettier: ## prettify the source code using prettier
	@echo "Running prettier..."
	@yarn prettier

test: build test-unit lint test-e2e ## launch all tests

test-unit: ## launch unit tests
	@if [ "$(CI)" != "true" ]; then \
		echo "Running unit tests..."; \
		yarn test-unit; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Running unit tests in CI..."; \
		yarn test-unit-ci; \
	fi

test-unit-watch: ## launch unit tests and watch for changes
	echo "Running unit tests..."; \
	yarn test-unit --watch; \

test-e2e: ## launch end-to-end tests (ex. BROWSER=firefox make test-e2e)
	@if [ "$(build)" != "false" ]; then \
		echo 'Building example code (call "make build=false test-e2e" to skip the build)...'; \
		cd examples/simple && BABEL_ENV=cjs yarn build; \
	fi

	@NODE_ENV=test cd cypress && yarn test


test-e2e-local: ## launch end-to-end tests for development
	@echo 'Starting e2e tests environment. Ensure you started the simple example first (make run-simple)'
	@cd cypress && yarn start

storybook: ## Launch the storybook
	@echo "Running storybook..."
	@ONLY=${ONLY} yarn storybook

build-storybook: ## Build the storybook
	@echo "Building storybook..."
	@yarn build-storybook
