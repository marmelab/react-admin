# `<RichTextInput>` for react-admin

For editing HTML with [react-admin](https://github.com/marmelab/react-admin), use the `<RichTextInput>` component. It embarks [quill](https://quilljs.com/), a popular cross-platform Rich Text Editor.

![`<RichTextInput>` example](https://marmelab.com/react-admin/img/rich-text-input.png)

## Installation

```sh
npm install ra-input-rich-text --save-dev
```

## Usage

```jsx
import * as React from "react";
import {
    DateInput,
    Edit,
    EditButton,
    TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <TextInput disabled label="Id" source="id" />
        <TextInput source="title" validation={{ required: true }} />
        <TextInput multiline source="teaser" validation={{ required: true }} />
        <RichTextInput source="body" validation={{ required: true }} />
        <DateInput label="Publication date" source="published_at" />
    </Edit>
);
```

You can customize the rich text editor toolbar using the `toolbar` attribute, as described on the [Quill official toolbar documentation](https://quilljs.com/docs/modules/toolbar/).

```jsx
<RichTextInput source="body" toolbar={[ ['bold', 'italic', 'underline', 'link'] ]} />
```

If you need more customization, you can access the quill object through the `configureQuill` callback that will be called just after its initialization.

```js
const configureQuill = quill => quill.getModule('toolbar').addHandler('bold', function (value) {
    this.quill.format('bold', value)
});

// ...

<RichTextInput source="text" configureQuill={configureQuill}/>
```

**Tip**: When used inside a material-ui `<Card>` (e.g in the default `<Edit>` view), `<RichTextInput>` displays link tooltip as cut off when the user wants to add a hyperlink to a word located on the left side of the input. This is due to an incompatibility between material-ui's `<Card>` component and Quill's positioning algorithm for the link tooltip. 

To fix this problem, you should override the default card style, as follows:

```diff
import { Edit, SimpleForm, TextInput } from 'react-admin';
+import { withStyles } from '@material-ui/core/styles';

-const PostEdit = props => (
+const PostEdit = withStyles({ card: { overflow: 'initial' } })(props => (
   <Edit {...props}>
       <SimpleForm>
            // ...
       </SimpleForm>
   </Edit>
-);
+));
```

## License

This library is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
