# [2018-04-13] - dka - Merge to RC2

- Change the original repo to `https://github.com/marmelab/react-admin`.
- Merge original repo to get RC2, from commit [ba0b514](https://github.com/marmelab/admin-on-rest/commit/ba0b514068fc01f94282a7e3de1f599b55e7ca3e) to [e7d9fb0](https://github.com/yeutech/react-admin/commit/e7d9fb0589cbe3f2e0c46c4e5ab285e0b50cdd14)
- Upgrade CI environment to node 10.
- Upgrade CI environment to yarn 1.6.0.
- Upgrade CI environment to npm latest.

# [2018-04-13] - dka - Creating examples projects

- Adding examples `demo-bs`.
- Adding examples `simple-bs`.
- Todo: use `bootstrap-styled`.

# [2018-04-12] - dka - Fix Translation @yeutech

- Fix TranslationProvider.

# [2018-04-09] - dka - Create scope @yeutech

- Create scope `@yeutech`.
- Create version `2.0.0-beta4-yeutech.3`.
- Pull changes from `default/next` until commit [ba0b514](https://github.com/marmelab/admin-on-rest/commit/ba0b514068fc01f94282a7e3de1f599b55e7ca3e)

# [2018-04-06] - dka - Replace polyglot with react-intl

- Reconfigure dependencies.
- Replace original `TranslationProvider` that used `node-polyglot` with our own.
- Replace `node-polyglot` with `react-intl`.
- Remove `ra-language-english` and `ra-language-french`.
- Create translation package `ra-language-intl`.
