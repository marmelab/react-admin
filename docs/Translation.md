---
layout: default
title: "Translation"
---

# Translation

The react-admin user interface uses English as the default language. But you can also display the UI and content in other languages, allow changing language at runtime, even lazy-loading optional languages to avoid increasing the bundle size with all translations. 

You will use translation features mostly via the `i18nProvider`, and a set of hooks (`useTranslate`, `useLocaleState`).

**Tip**: We'll use a bit of custom vocabulary in this chapter:
 
- "i18n" is a shorter way to write "internationalization" (an "i" followed by 18 letters followed by "n") 
- "locale" is a concept similar to languages, but it also includes the concept of country. For instance, there are several English locales (like `en_us` and `en_gb`) because US and UK citizens don't use exactly the same language. For react-admin, the "locale" is just a key for your i18nProvider, so it can have any value you want.

## Introducing the `i18nProvider`

Just like for data fetching and authentication, react-admin relies on a simple object for translations. It's called the `i18nProvider`, and it manages translation and language changes using tree methods:

```js
const i18nProvider = {
    translate: (key, options) => string,
    changeLocale: locale => Promise,
    getLocale: () => string,
}
```
