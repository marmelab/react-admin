---
layout: default
title: "The Translate Component"
---

# `<Translate>`

The `<Translate>` component renders a translated message based on a translation key.

## Usage

The component will look up the translation for the `i18nKey` in the `i18nProvider` and render it. If not found, it will render the `children` prop.

```tsx
import { Translate, useRecord, useUpdate } from 'react-admin';

const MarkAsUnreadButton = () => {
    const record = useRecord();
    const update = useUpdate();
    const handleClick = () => {
        update('messages', { id: record.id, data: { isRead: false } });
    };
    return (
        <button onClick={handleClick}>
            <Translate i18nKey="my.messages.actions.mark_as_unread">
                Mark as Unread
            </Translate>
        </button>;
    );
}
```

**Tip:** You can also use [the `useTranslate` hook](./useTranslate.md) to get a translated message.

## Props

| Prop       | Required | Type        | Default | Description                                                     |
| ---------- | -------- | ----------- | ------- | --------------------------------------------------------------- |
| `i18nKey`  | Required | `string`    | -       | The translation key.                                            |
| `args`     | Optional | `Object`    | -       | The options used for pluralization and interpolation.         |
| `children` | Optional | `ReactNode` | -       | The default content to display if the translation is not found. |

## `args`

Use the `args` props to pass additional options to the `translate` function, e.g. for [pluralization or interpolation](./TranslationTranslating.md#interpolation-pluralization-and-default-translation).

{% raw %}

```tsx
const messages = {
    custom: {
        hello_world: 'Hello, %{name}!',
    },
};

<Translate i18nKey="custom.hello_world" args={{ name: 'John' }} />
// Hello, John!
```

{% endraw %}

One particular option is `smart_count`, which is used for pluralization.

{% raw %}

```tsx
const messages = {
    ra: {
        notification: {
            deleted: '1 item deleted |||| %{smart_count} items deleted',
        },
    },
};

<Translate i18nKey="ra.notification.deleted" args={{ smart_count: 2 }} />
// 2 items deleted
```

{% endraw %}

## `children`

`<Translate>` renders its child node if  `translate` doesn't find a translation for the `i18nKey`.

```tsx
const messages = {};

<Translate i18nKey="ra.page.loading">Loading</Translate>
// Loading
```

## `i18nKey`

The translation key, used to look up the translation message.

```tsx
const messages = {
    resources: {
        reviews: {
            action: {
                reject: 'Reject review',
            },
        },
    },
};

<Translate i18nKey="resources.reviews.action.reject" />
// Reject review
```
