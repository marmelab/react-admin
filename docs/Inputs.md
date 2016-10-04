---
layout: default
title: "Input Components"
---

# Input Components

An `Input` component displays an input, or a dropdown list, a list of radio buttons, etc. Such components allow to edit a record property, and are common in the `<Edit>`, `<Create>`, and `<Filter>` views.

```js
// in src/posts.js
import React from 'react';
import { Edit, DisabledInput, LongTextInput, ReferenceInput, SelectInput, TextInput } from 'admin-on-rest/lib/mui';

export const PostEdit = (props) => (
    <Edit title={PostTitle} {...props}>
        <DisabledInput source="id" />
        <ReferenceInput label="User" source="userId" reference="users">
            <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="title" />
        <LongTextInput source="body" />
    </Edit>
);
```

All input components accept the following attributes:

* `source`: Property name of your entity to view/edit. This attribute is required.
* `label`: Used as a table header of an input label. Defaults to the `source` when omitted.

```js
<TextInput source="zb_title" label="Title" />
```

If you edit a record with a complex structure, you can use a path as the `source` parameter. For instance, if the API returns the following 'book' record:

```js
{
    id: 1234,
    title: 'War and Peace',
    author: {
        firstName: 'Leo',
        lastName: 'Tolstoi'
    }
}
```

Then you can display a text input to edit the author first name as follows:

```js
<TextInput source="author.firstName" />
```

## `<LongTextInput>`

`<LongTextInput>` is the best choice for multiline text values. It renders as an auto expandable textarea.

``` js
import { LongTextInput } from 'admin-on-rest/mui';

<LongTextInput source="summary" />
```

## `<RichTextInput>`

`<RichTextInput>` is the ideal component if you want to allow your users to edit some HTML contents. It
is powered by [Quill](https://quilljs.com/).

``` js
import { RichTextInput } from 'admin-on-rest/mui';

<RichTextInput source="body" />
```

![RichTextInput](./img/rich-text-input.png)

*Tip*: `quill` is only specified as a peer dependency in the `package.json`. If you want to use the `<RichTextInput>` component in your app, you'll have to add `quill` to your app:

```sh
npm install --save-dev quill
```

You can customize the rich text editor toolbar using the `toolbar` attribute, as described on the [Quill official toolbar documentation](https://quilljs.com/docs/modules/toolbar/).

```js
<RichTextInput source="body" toolbar={[ ['bold', 'italic', 'underline', 'link'] ]} />
```

## `<TextInput>`

`<TextInput>` is the most common input. It is used for texts, emails, URL or passwords. In translates to an HTML `<input>` tag.

``` js
import { TextInput } from 'admin-on-rest/mui';

<TextInput source="title" />
```

![TextInput](./img/text-input.png)

You can choose a specific input type using the `type` attribute, among `text` (the default), `email`, `url`, or `password`:

``` js
<TextInput label="Email Address" source="email" type="email" />
```
