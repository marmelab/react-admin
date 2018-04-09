# [2018-06-09] - dka - Create scope @yeutech

- Create scope `@yeutech`.
- Create version `2.0.0-beta4-yeutech.0`.
- Pull changes from `default/next` until commit [ba0b514](https://github.com/marmelab/admin-on-rest/commit/ba0b514068fc01f94282a7e3de1f599b55e7ca3e)

# [2018-06-04] - dka - Replace polyglot with react-intl

- Reconfigure dependencies, 
- Replace original `TranslationProvider` that used `node-polyglot` with our own.
- Replace `node-polyglot` with `react-intl`.
- Remove `ra-language-english` and `ra-language-french`.
- Create translation package `ra-language-intl`.
