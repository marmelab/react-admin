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

build-demo: ## compile the demo example to static js
	@yarn -s build-demo

run-graphql-demo: ## run the demo example
	@yarn -s run-graphql-demo

build-composite:
	@echo "Build composite project";
	@yarn build

copy-docs-react-admin:
	@echo "Copy docs react-admin";
	@rm -rf ./packages/react-admin/docs
	@cd ./packages/react-admin
	@mkdir packages/react-admin/docs
	@cp docs/*.md packages/react-admin/docs

build: build-composite copy-docs-react-admin

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

declarations-test:
	@echo 'declarations-test'
	@yarn validate-emitted-declarations