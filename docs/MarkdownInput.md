---
layout: default
title: "The MarkdownInput Component"
---

# `<MarkdownInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to edit and preview Markdown data, based on [the Toast UI editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor).

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

## Props

`<MarkdownInput>` accepts the following props:

| Prop                 | Required | Type      | Default    | Description                                                           |
| -------------------- | -------- | --------- | ---------- | --------------------------------------------------------------------- |
| `source`             | Required | `string`  |            | The field name in the record                                          |
| `fullWidth`          | Optional | `boolean` | `true`     | If `true`, the input will expand to fill the form width               |
| `label`              | Optional | `string`  |            | The label. If not set, the label is inferred from the child component |
| `helperText`         | Optional | `string`  |            | The helper text to display under the input                            |
| `previewStyle`       | Optional | `string`  | `vertical` | Markdown editor's preview style. Can be `tab` or `vertical`           |
| `height`             | Optional | `string`  | `512px`    | Markdown editor's height                                              |
| `initialEditType`    | Optional | `string`  | `wysiwyg`  | Markdown editor's initial edit type. Can be `markdown` or `wysiwyg`   |
| `useCommandShortcut` | Optional | `boolean` | `true`     | Whether use keyboard shortcuts to perform commands                    |

`<MarkdownInput>` also accepts the [common input props](https://marmelab.com/react-admin/Inputs.html#common-input-props) and the [editor props](https://nhn.github.io/tui.editor/latest/ToastUIEditorCore) from the Toast UI editor.

## `source`

Specifies the field of the record that the input should edit. It is required.

{% raw %}

```jsx
<Form record={{ id: 123, title: 'Hello, world!', body: '<p>Lorem Ipsum</p>' }}>
    <MarkdownInput source="body" />
    {/* default value is "<p>Lorem Ipsum</p>" */}
</Form>
```

{% endraw %}

## `fullWidth`

You can make the markdown editor full width by setting the `fullWidth` prop to `true`:

{% raw %}

```jsx
<SimpleForm>
    <MarkdownInput source="description" fullwidth />
</SimpleForm>
```

{% endraw %}

## `helperText`

If you need to display a text below the markdown editor (usually to explain the expected data to the user), use the `helperText` prop.

{% raw %}

```jsx
<SimpleForm>
    <MarkdownInput
        source="description"
        helperText="Enter a description of the post"
    />
</SimpleForm>
```

{% endraw %}

## `previewStyle`

You can customize the preview style by setting the `previewStyle` prop. It accepts `tab` or `vertical` and is set to `vertical` by default.

{% raw %}

```jsx
<SimpleForm>
    <MarkdownInput source="description" previewStyle="tab" />
</SimpleForm>
```

{% endraw %}

## `height`

The editor has a size that can be customized by setting the `height` prop. It is set to `512px` by default. You can use `px` or `%` units.

{% raw %}

```jsx
<SimpleForm>
    <MarkdownInput source="description" height="300px" />
</SimpleForm>
```

{% endraw %}

## `initialEditType`

This prop allows to set the initial edit type of the editor. It accepts `markdown` or `wysiwyg` and is set to `wysiwyg` by default.

{% raw %}

```jsx
<SimpleForm>
    <MarkdownInput source="description" initialEditType="markdown" />
</SimpleForm>
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

## Add Your Own Buttons

You can add your own buttons to the markdown editor by using the `toolbarItems` prop. It accepts an array of [toolbar items](https://nhn.github.io/tui.editor/latest/ToastUIEditorToolbar#toolbar-items) and is set to `null` by default.

{% raw %}

```jsx
function createLastButton() {
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

return (
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
);
```

{% endraw %}

Check [the `ra-markdown` documentation](https://marmelab.com/ra-enterprise/modules/ra-markdown) for more details.
