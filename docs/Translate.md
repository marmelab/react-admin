---
layout: default
title: "The Translate Component"
---

# `<Translate>`

If you need to translate messages in your own components, React-admin provides the `<Translate>` component which displays your translated messages.

# Usage

```tsx
const MyHelloButton = () => <button><Translate i18nKey="custom.hello_world" /></button>;

export default MyHelloButton;
```

**Tip:** You can directly use the translation function with [the `useTranslate` hook](./useTranslate.md).

## Props

| Prop       | Required | Type     | Default | Description                                                     |
| ---------- | -------- | -------- | ------- | --------------------------------------------------------------- |
| `args`     | Optional | `Object` | -       | The arguments used for pluralization and interpolation.         |
| `children` | Optional | `string` | -       | The default content to display if the translation is not found. |
| `i18nKey`  | Required | `string` | -       | The translation key.                                            |

## `args`: Pluralization and Interpolation

If your i18n provider provides some nice features such as interpolation and pluralization (as [Polyglot.js](./Translation.md#ra-i18n-polyglot) and [i18next](./Translation.md#ra-i18n-i18next) did), that you can use in react-admin.

{%raw%}

```tsx
// in english.ts
import englishMessages from 'ra-language-english';

const messages = {
    ...englishMessages,
    custom: {
        my_key: 'My Translated Key',
        hello_world: 'Hello, %{my_world}!',
        count_beer: 'Select one beer |||| Select %{smart_count} beers',
    },
};

export default messages;
```

```tsx
export const MyHelloButton = () => (
    <button>
        <Translate i18nKey="custom.hello_world" args={{ my_world: 'world' }} />
    </button>
);

export const SelectBeerButton = () => (
    <button>
        <Translate i18nKey="custom.count_beer" args={{ smart_count: 2 }} />
    </button>
);
```

{%endraw%}

## `children`

You can provide a `children` to display if the translation function doesn't find a message with your `i18nKey`.

```tsx
const LoadingMessage = () => <Translate i18nKey="ra.page.loading">Loading</Translate>;
```

## `i18nKey`

The key used to translate your message with your polyglot disctionnaries like `ra.action.unselect`, `custom.my_key`, etc.
