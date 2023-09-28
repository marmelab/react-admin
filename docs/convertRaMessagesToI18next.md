---
layout: default
title: "convertRaTranslationsToI18next"
---

# `convertRaTranslationsToI18next`

A function that takes translations from a standard react-admin language package and converts them to i18next format.
It transforms the following:
- interpolations wrappers from `%{foo}` to `{{foo}}` unless a prefix and/or a suffix are provided
- pluralization messages from a single key containing text like `"key": "foo |||| bar"` to multiple keys `"foo_one": "foo"` and `"foo_other": "bar"`

## Usage

```ts
import englishMessages from 'ra-language-english';
import { convertRaMessagesToI18next } from 'ra-i18n-18next';

const messages = convertRaMessagesToI18next(englishMessages);
```

## Parameters

| Parameter            | Required | Type        | Default | Description                                                      |
| -------------------- | -------- | ----------- | ------- | ---------------------------------------------------------------- |
| `raMessages`         | Required | object      |         | An object containing standard react-admin translations such as provided by ra-language-english |
| `options`            | Optional | object      |         | An object providing custom interpolation suffix and/or suffix |

@example Convert the english translations from ra-language-english to i18next format with custom interpolation wrappers

### `options`

If you provided interpolation options to your i18next instance, you should provide them when calling this function:

```ts
import englishMessages from 'ra-language-english';
import { convertRaMessagesToI18next } from 'ra-i18n-18next';

const messages = convertRaMessagesToI18next(englishMessages, {
   prefix: '#{',
  suffix: '}#',
});
```
