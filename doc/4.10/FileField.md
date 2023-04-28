---
layout: default
title: "The FileField Component"
---

# `<FileField>`

If you need to render a link to a file based on a path contained in a record field, you can use the `<FileField />` component:

```jsx
import { FileField } from 'react-admin';

<FileField source="url" title="title" />

// renders the record { id: 123, url: 'doc.pdf', title: 'Presentation' } as 
<div>
    <a href="doc.pdf" title="Presentation">Presentation</a>
</div>
```

This field is also often used within a [`<FileInput />`](./FileInput.md) component to display preview.

## Properties

| Prop       | Required | Type                      | Default      | Description                                                                                                                                            |
| ---------- | -------- | ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src`      | Optional | `string`                  | -            | A function returning a string (or an element) to display based on a record                                                                             |
| `title`    | Optional | `string`                  | record.title | The name of the property containing the image source if the value is an array of objects                                                               |
| `target`   | Optional | `string`                  | -            | The link target. Set to "_blank" to open the file on a new tab                                                                                         |
| `download` | Optional | `boolean` &#124; `string` | -            | Prompts the user to save the linked URL instead of navigating to it                                                                                    |
| `ping`     | Optional | `string`                  | -            | A space-separated list of URLs. When the link is followed, the browser will send POST requests with the body PING to the URLs. Typically for tracking. |
| `rel`      | Optional | `string`                  | -            | The relationship of the linked URL as space-separated link types (e.g. 'noopener', 'canonical', etc.).                                                 |

`<FileField>` also accepts the [common field props](./Fields.md#common-field-props).

## `sx`: CSS API

The `<FileField>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)).

To override the style of all instances of `<FileField>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaFileField` key.

## Usage

The optional `title` prop points to the file title property, used for `title` attributes. It can either be a hard-written string, or a path within your JSON object:

```jsx
// { file: { url: 'doc.pdf', title: 'Presentation' } }

<FileField source="file.url" title="file.title" />
// renders the file name as "Presentation"

<FileField source="file.url" title="File" />
// renders the file name as "File", since "File" is not a path in previous given object
```

If the record actually contains an array of files in its property defined by the `source` prop, the `src` prop will be needed to determine the `href` value of the links, for example:

```js
// This is the record
{
    files: [
        { url: 'image1.jpg', desc: 'First image' },
        { url: 'image2.jpg', desc: 'Second image' },
    ]
}

<FileField source="files" src="url" title="desc" />
```

You can optionally set the `target` prop to choose which window will the link try to open in.

```jsx
// Will make the file open in new window
<FileField source="file.url" target="_blank" />
```
