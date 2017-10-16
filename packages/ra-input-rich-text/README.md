# `<RichTextInput>` for react-admin

For editing HTML with [react-admin](https://github.com/marmelab/react-admin), use the `<RichTextInput>` component. It embarks [quill](http://quilljs.com/), a popular cross-platform Rich Text Editor.

![`<RichTextInput>` example](http://marmelab.com/admin-on-rest/img/rich-text-input.png)

## Installation

```sh
npm install ra-input-rich-text --save-dev
```

## Usage

```js
import React from 'react';
import {
    DateInput,
    Edit,
    EditButton,
    LongTextInput,
    TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput source="title" validation={{ required: true }} />
        <LongTextInput source="teaser" validation={{ required: true }} />
        <RichTextInput source="body" validation={{ required: true }} />
        <DateInput label="Publication date" source="published_at" />
    </Edit>
);
```

You can customize the rich text editor toolbar using the `toolbar` attribute, as described on the [Quill official toolbar documentation](https://quilljs.com/docs/modules/toolbar/).

```js
<RichTextInput source="body" toolbar={[ ['bold', 'italic', 'underline', 'link'] ]} />
```

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
