---
layout: default
title: "The Translate Component"
---

# `<Translate>`

If you need to translate messages in your own components, React-admin provides the `<Translate>` component which displays your translated messages.

# Usage

```tsx
const MyHelloButton = () => <Translate i18nKey="custom.hello_world" />;

export default MyHelloButton;
```

**Tip:** You can directly use the translation function with [the `useTranslate` hook](./useTranslate.md).

## Props

| Prop        | Required | Type                    | Default            | Description                                             |
| ----------- | -------- | ----------------------- | ------------------ | ------------------------------------------------------- |
| `args`      | Optional | `Object`                | -                  | The arguments used for pluralization and interpolation. |
| `children`  | Optional | `string`                | -                  | The default translation if the translation failed.      |
| `empty`     | Optional | `string` &#124; `false` | `"no translation"` | Message to be displayed if there is no translation.     |
| `i18nKey`   | Required | `string`                | -                  | The translation key.                                    |

Additional props are passed to the root element.

## `args`: Pluralization and Interpolation

Polyglot.js provides some nice features such as interpolation and pluralization, that you can use in react-admin.

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

## `empty`

When your translation key doesn't fit with your dictionnary, react-admin displays an empty text.

```tsx
const MyMessage = () => <Translate i18nKey="custom.myKey" empty="translation failed" />;
```

**Tip:** You can set `empty` to false to don't render anything in this case.

## `i18nKey`

The key used to translate your message with your polyglot disctionnaries like `ra.action.unselect`, `custom.my_key`, etc.
