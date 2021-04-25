ui_npm_prefix = npm --prefix ./packages/ui
core_npm_prefix = npm --prefix ./packages/core
abstract_adapter_npm_prefix = npm --prefix ./packages/framework-adapter-abstract
fixtures_dir = fixtures

fixture.bull-server:
	cd $(fixtures_dir)/bull-server && docker-compose up
deps:
	npm ci
ui.dev-server:
	$(ui_npm_prefix) run serve
ui.dev-server-with-mocks:
	$(ui_npm_prefix) run serve-with-mocks
add-dep:
	npx lerna add $(dep) --scope=@bull-monitor/$(pkg)
publish:
	npx lerna publish from-package --yes
add-dev-dep:
	npx lerna add $(dep) --scope=@bull-monitor/$(pkg) --dev
ui.dev:
	$(ui_npm_prefix) run dev
ui.build:
	$(ui_npm_prefix) run build
ui.build-demo:
	$(ui_npm_prefix) run build-demo
ui.test:
	$(ui_npm_prefix) run test
ui.gen-ts-types:
	cd packages/ui/internal && npx graphql-codegen --config ./gql-ts-codegen.yml
abstract-adapter.dev:
	$(abstract_adapter_npm_prefix) run dev
root.build:
	$(core_npm_prefix) run build
root.dev:
	$(core_npm_prefix) run dev
root.gen-ts-types:
	cd packages/root/internal && npx graphql-codegen --config ./gql-ts-codegen.yml
lerna.link:
	npx lerna link
lerna.build:
	npx lerna run build
lerna.bootstrap:
	npx lerna bootstrap
example.express:
	npm --prefix ./examples/express start
example.koa:
	npm --prefix ./examples/koa start
example.hapi:
	npm --prefix ./examples/hapi start
example.fastify:
	npm --prefix ./examples/fastify start