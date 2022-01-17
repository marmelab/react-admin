---
layout: default
title: "The RichTextField Component"
---

# `<RichTextField>`

This component displays some HTML content. The content is "rich" (i.e. unescaped) by default.

```jsx
import { RichTextField } from 'react-admin';

<RichTextField source="body" />
```

![RichTextField](./img/rich-text-field.png)

## Properties

| Prop        | Required | Type      | Default  | Description                                          |
| ----------- | -------- | --------- | -------- | ---------------------------------------------------- |
| `stripTags` | Optional | `boolean` | `false`  | If `true`, remove all HTML tags and render text only |

`<RichTextField>` also accepts the [common field props](./Fields.md#common-field-props).

## Usage

The `stripTags` prop allows to remove all HTML markup, preventing some display glitches (which is especially useful in list views, or when truncating the content).

```jsx
import { RichTextField } from 'react-admin';

<RichTextField source="body" stripTags />
```
