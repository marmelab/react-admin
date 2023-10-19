---
layout: default
title: "The RichTextField Component"
---

# `<RichTextField>`

This component displays some HTML content. The content is "rich" (i.e. unescaped) by default.

![RichTextField](./img/rich-text-field.png)

This component leverages [the `dangerouslySetInnerHTML` attribute](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html), but uses [the DomPurify library](https://github.com/cure53/DOMPurify) to sanitize the HTML before rendering it. It means it is **safe from Cross-Site Scripting (XSS) attacks** - but it's still a good practice to sanitize the value server-side.

## Usage

```jsx
import { RichTextField } from 'react-admin';

<RichTextField source="body" />
```


## Props

| Prop            | Required | Type      | Default  | Description                                                           |
| --------------- | -------- | --------- | -------- | --------------------------------------------------------------------- |
| `stripTags`     | Optional | `boolean` | `false`  | If `true`, remove all HTML tags and render text only                  |
| `purifyOptions` | Optional | `object`  | -        | The options passed to the DomPurify library when calling `sanitize()` |

`<RichTextField>` also accepts the [common field props](./Fields.md#common-field-props).

## `stripTags`

The `stripTags` prop allows to remove all HTML markup, preventing some display glitches (which is especially useful in list views, or when truncating the content).

```jsx
import { RichTextField } from 'react-admin';

<RichTextField source="body" stripTags />
```

## `purifyOptions`

The `purifyOptions` prop allows to pass additional options to the DomPurify library when calling `sanitize()`.

For instance, you can use the `ADD_ATTR` option to allow additional attributes, like `'target'`:

{% raw %}
```jsx
import { RichTextField } from 'react-admin';

<RichTextField source="body" purifyOptions={{ ADD_ATTR: ['target'] }} />
```
{% endraw %}

**Tip:** More available options can be found in the [DomPurify Readme](https://github.com/cure53/DOMPurify#can-i-configure-dompurify).

## Open Links in a New Tab

If you wish to open all links in a new tab, you can use the following snippet to add the `target="_blank"` attribute to all links:

```tsx
import { RichTextField, RichTextFieldProps } from 'react-admin';
import dompurify from 'dompurify';

const TargetBlankEnabledRichTextField = (props: RichTextFieldProps) => {
    dompurify.addHook('afterSanitizeAttributes', function (node) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });
    return <RichTextField {...props} />;
};

const MyComponent = () => (
    <TargetBlankEnabledRichTextField source="body" />
);
```

**Tip:** Note that this also adds the `rel="noopener"` attribute to all links, to prevent [reverse tabnabbing](https://mathiasbynens.github.io/rel-noopener/).

