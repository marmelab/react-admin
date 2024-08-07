---
layout: default
title: 'The MarkdownInput Component'
---

# `<MarkdownInput>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component allows to edit and preview Markdown data, based on [the Toast UI editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor). To be used in Edit and Create views.

<video controls autoplay playsinline muted loop>
  <source src="./img/markdown-input.webm" type="video/webm"/>
  <source src="./img/markdown-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput } from '@react-admin/ra-markdown';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <MarkdownInput source="description" />
        </SimpleForm>
    </Edit>
);
```

You can customize the markdown renderer used for the preview, so that it matches the rendering you need in read mode just by applying the CSS rules you want.

```jsx
import { Edit, SimpleForm, TextInput } from "react-admin";
import { MarkdownInput } from "@react-admin/ra-markdown";

// Additional props are passed to `tui-editor`'s `<Editor>` component
const options = {
  previewStyle: "tab",
  height: "300px",
  initialEditType: "markdown",
  useCommandShortcut: false,
};

const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <MarkdownInput source="description" {...options} />
    </SimpleForm>
  </Edit>
);
```

## Props

`<MarkdownInput>` accepts the following props:

| Prop                 | Required | Type      | Default    | Description                                                                                         |
| -------------------- | -------- | --------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `source`             | Required | `string`  |            | The field name in the record                                                                        |
| `fullWidth`          | Optional | `boolean` | `true`     | If `true`, the input will expand to fill the form width                                             |
| `height`             | Optional | `string`  | `512px`    | Markdown editor's height                                                                            |
| `helperText`         | Optional | `string`  |            | The helper text to display under the input                                                          |
| `initialEditType`    | Optional | `string`  | `wysiwyg`  | Markdown editor's initial edit type. Can be `markdown` or `wysiwyg`                                 |
| `label`              | Optional | `string`  |            | The label. If not set, the label is inferred from the child component                               |
| `previewStyle`       | Optional | `string`  | `vertical` | Markdown editor's preview style. Can be `tab` or `vertical`                                         |
| `toolbarItems`       | Optional | `array`   |            | The toolbar items to display in the editor. See [Adding Buttons](#adding-buttons) for more details. |
| `useCommandShortcut` | Optional | `boolean` | `true`     | Whether use keyboard shortcuts to perform commands                                                  |

`<MarkdownInput>` also accepts the [common input props](https://marmelab.com/react-admin/Inputs.html#common-input-props) and the [editor props](https://nhn.github.io/tui.editor/latest/ToastUIEditorCore) from the [Toast UI](https://ui.toast.com/) editor.

## `fullWidth`

You can make the markdown editor full width by setting the `fullWidth` prop to `true`:

```jsx
<SimpleForm>
    <MarkdownInput source="description" fullwidth />
</SimpleForm>
```

## `height`

The editor has a size that can be customized by setting the `height` prop. It is set to `512px` by default. You can use `px` or `%` units.

```jsx
<SimpleForm>
    <MarkdownInput source="description" height="300px" />
</SimpleForm>
```

## `helperText`

If you need to display a text below the markdown editor (usually to explain the expected data to the user), use the `helperText` prop.

```jsx
<SimpleForm>
    <MarkdownInput
        source="description"
        helperText="Enter a description of the post"
    />
</SimpleForm>
```

## `initialEditType`

This prop allows to set the initial edit type of the editor. It accepts `markdown` or `wysiwyg` and is set to `wysiwyg` by default.

```jsx
<SimpleForm>
    <MarkdownInput source="description" initialEditType="markdown" />
</SimpleForm>
```

## `label`

You can customize the label by setting the `label` prop. It is inferred from the `source` prop by default.

```jsx
<SimpleForm>
    <MarkdownInput source="description" label="Explanation" />
</SimpleForm>
```

## `previewStyle`

You can customize the preview style by setting the `previewStyle` prop. It accepts `tab` or `vertical` and is set to `vertical` by default.
- With the `vertical` style, the content and the preview will be displayed side by side.
- With the `tab` style, the content and the preview will be displayed in two separate tabs. Users can switch between the two tabs by clicking on the tab header.

```jsx
<SimpleForm>
    <MarkdownInput source="description" previewStyle="tab" />
</SimpleForm>
```

## `source`

Specifies the field of the record that the input should edit. It is required.

{% raw %}
```jsx
<Form record={{ id: 123, title: 'Hello, world!', body: '**Lorem Ipsum**' }}>
    <MarkdownInput source="body" />
    {/* default value is "**Lorem Ipsum**" */}
</Form>
```
{% endraw %}

## `useCommandShortcut`

You can disable the keyboard shortcuts by setting the `useCommandShortcut` prop to `false`. It is set to `true` by default.

{% raw %}
```jsx
<SimpleForm>
    <MarkdownInput source="description" useCommandShortcut={false} />
</SimpleForm>
```
{% endraw %}

## Adding Buttons

You can add your own buttons to the markdown editor by using the `toolbarItems` prop. It accepts an array of [toolbar items](https://nhn.github.io/tui.editor/latest/tutorial-example15-customizing-toolbar-buttons) and is set to `null` by default.

The following example shows a custom button in the toolbar that displays an alert when clicked. It uses the `createLastButton` function to create an HTML button element, and the `toolbarItems` prop to pass it to the toolbar.

{% raw %}
```tsx
// src/Example.tsx
import { Edit, SimpleForm } from 'react-admin';
import { MarkdownInput } from '@react-admin/ra-markdown';

function createLastButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'toastui-editor-toolbar-icons last';
    button.style.backgroundImage = 'none';
    button.style.margin = '0';
    button.style.width = '100%';
    button.innerHTML = `<i>Custom Button</i>`;
    button.addEventListener('click', () => {
        alert('Custom Button action');
    });

    return button;
}

const Example = () => (
    <Edit>
        <SimpleForm>
           <MarkdownInput
                source="description"
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    [
                        {
                            el: createLastButton(),
                            tooltip: 'Custom Command',
                            name: 'custom',
                        },
                    ],
                ]}
            />
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

## Accessing The Editor Instance

If you need to interact with the editor instance, you can access it by using a `ref` prop. 

The following example shows how to access the editor instance and call the `getMarkdown` method to display the markdown content.

```tsx
import { useRef, useState } from 'react';
import { Button, Edit, SimpleForm } from 'react-admin';
import { Alert } from '@mui/material';
import { Editor, MarkdownInput } from '@react-admin/ra-markdown';

export const PostEdit = () => {
    const editorRef = useRef<Editor>(null);
    const [md, setMd] = useState(null);
    const onClickGetMarkdownButton = () => {
        const instance = editorRef.current.getInstance();
        setMd(instance.getMarkdown());
    };
    return (
        <Edit>
            <SimpleForm>
                <MarkdownInput
                    label="Body"
                    source="body"
                    ref={editorRef}
                    defaultValue={'**Hello world**'}
                />
                <Button
                    label="Get markdown value"
                    onClick={onClickGetMarkdownButton}
                />
                {md && <Alert severity="success">Markdown result: {md}</Alert>}
            </SimpleForm>
        </Edit>
    );
};
```

Check [the `ra-markdown` documentation](https://react-admin-ee.marmelab.com/documentation/ra-markdown) for more details.
