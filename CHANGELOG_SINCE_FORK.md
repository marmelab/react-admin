# [2018-06-04] - dka - Replace polyglot with react-intl

- Reconfigure dependencies, 
- Replace original `TranslationProvider` that used `node-polyglot` with our own.
- Replace `node-polyglot` with `react-intl`.
- Remove `ra-language-english` and `ra-language-french`.
- Create translation package `ra-language-intl`.
