---
layout: default
title: 'The MarkdownInput Component'
---

# `<MarkdownInput>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> component allows to edit and preview Markdown data, based on [Milkdown](https://milkdown.dev/). To be used in Edit and Create views.

<video controls autoplay playsinline muted loop>
  <source src="./img/markdown-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

It offers two edition modes, which users switch with the tabs at the bottom of the input:

- **WYSIWYG**: a rich text editor, with a toolbar on top. Users can also format the selected text with a floating toolbar, and insert blocks with the `/` command.
- **Markdown**: the markdown source, with syntax highlighting, and a live preview. The preview is also editable.

The editor colors and fonts follow the Material UI theme, including the dark mode.

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

The editor props can be grouped in an object, e.g. to share the same configuration between several inputs:

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput, MarkdownInputProps } from '@react-admin/ra-markdown';

const options: Partial<MarkdownInputProps> = {
    previewStyle: 'tab',
    height: '300px',
    initialEditType: 'markdown',
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

| Prop                 | Required | Type                      | Default    | Description                                                    |
| -------------------- | -------- | ------------------------- | ---------- | -------------------------------------------------------------- |
| `source`             | Required | `string`                  |            | The field name in the record                                   |
| `configureMilkdown`  | Optional | `(crepe: Crepe) => void`  |            | Called before the editor is created, e.g. to register plugins  |
| `fullWidth`          | Optional | `boolean`                 | `true`     | If `true`, the input expands to fill the form width            |
| `height`             | Optional | `string \| number`        | `512px`    | The editor height                                              |
| `helperText`         | Optional | `string`                  |            | The helper text to display under the input                     |
| `initialEditType`    | Optional | `'markdown' \| 'wysiwyg'` | `wysiwyg`  | The edition mode displayed first                               |
| `label`              | Optional | `string \| false`         |            | The label. If not set, the label is inferred from the `source` |
| `onReady`            | Optional | `(crepe: Crepe) => void`  |            | Called once the editor is created                              |
| `previewStyle`       | Optional | `'vertical' \| 'tab'`     | `vertical` | How the markdown mode displays the source and the preview      |
| `ref`                | Optional | `Ref<MarkdownEditorRef>`  |            | Gives access to the editor instance                            |
| `toolbarItems`       | Optional | `array`                   |            | The buttons of the toolbar                                     |
| `useCommandShortcut` | Optional | `boolean`                 | `true`     | Whether the formatting keyboard shortcuts are enabled          |

`<MarkdownInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `configureMilkdown`

The WYSIWYG editor is based on [Milkdown](https://milkdown.dev/). Its plugins must be registered before the editor is created, so the [`ref`](#ref) gives access to the editor too late. Use the `configureMilkdown` prop instead: it receives the [Crepe](https://milkdown.dev/docs/guide/using-crepe) instance before its creation, and lets you register plugins with `crepe.editor.use()`, or change the editor context with `crepe.editor.config()`.

For instance, to add a [remark](https://github.com/remarkjs/remark) plugin, and a ProseMirror plugin highlighting some text with decorations:

```jsx
import { Edit, SimpleForm } from 'react-admin';
import { MarkdownInput } from '@react-admin/ra-markdown';
import { Plugin } from '@milkdown/kit/prose/state';
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view';
import { $prose, $remark } from '@milkdown/kit/utils';
import remarkDirective from 'remark-directive';

const directive = $remark('remarkDirective', () => remarkDirective);

const highlight = $prose(
    () =>
        new Plugin({
            props: {
                decorations: state =>
                    DecorationSet.create(state.doc, [
                        Decoration.inline(1, 6, { class: 'highlight' }),
                    ]),
            },
        })
);

const configureMilkdown = crepe => {
    crepe.editor.use(directive).use(highlight);
};

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <MarkdownInput
                source="description"
                configureMilkdown={configureMilkdown}
            />
        </SimpleForm>
    </Edit>
);
```

[`<MarkdownField>`](./MarkdownField.md) accepts the same prop.

**Tip**: `configureMilkdown` is only read when the editor is created: changing it afterwards has no effect. It only applies to the WYSIWYG editor, not to the source of the markdown mode.

## `fullWidth`

The input fills the form width by default. Set the `fullWidth` prop to `false` to disable it:

{% raw %}
```jsx
<MarkdownInput source="description" fullWidth={false} />
```
{% endraw %}

## `height`

The editor is `512px` high by default. You can change it with the `height` prop, using any CSS unit, or a number of pixels:

```jsx
<MarkdownInput source="description" height="300px" />
```

When the content is longer, the editor scrolls.

## `helperText`

If you need to display a text below the editor (usually to explain the expected data to the user), use the `helperText` prop.

```jsx
<MarkdownInput
    source="description"
    helperText="Enter a description of the post"
/>
```

## `initialEditType`

The edition mode displayed first: `wysiwyg` (the default) or `markdown`. Users can switch modes with the tabs at the bottom of the input.

```jsx
<MarkdownInput source="description" initialEditType="markdown" />
```

## `label`

You can customize the label by setting the `label` prop. It is inferred from the `source` prop by default. Set it to `false` to hide the label.

```jsx
<MarkdownInput source="description" label="Explanation" />
```

## `onReady`

Called once the WYSIWYG editor is created, with the [Crepe](https://milkdown.dev/docs/guide/using-crepe) instance.

```jsx
<MarkdownInput
    source="description"
    onReady={crepe => console.log(crepe.getMarkdown())}
/>
```

[`<MarkdownField>`](./MarkdownField.md) accepts the same prop.

**Tip**: To register Milkdown plugins, use [`configureMilkdown`](#configuremilkdown) instead: `onReady` is called too late for that.

## `previewStyle`

How the markdown mode displays the source and its preview. It has no effect in the WYSIWYG mode.

- `vertical` (default): the source and the preview are displayed side by side.
- `tab`: the source and the preview are displayed in two tabs, _Write_ and _Preview_, at the top of the input.

```jsx
<MarkdownInput
    source="description"
    initialEditType="markdown"
    previewStyle="tab"
/>
```

## `ref`

If you need to interact with the editor, you can access it with a `ref`. Its `getInstance()` method returns the [Crepe](https://milkdown.dev/docs/guide/using-crepe) editor instance, or `undefined` until the editor is created.

The following example calls the `getMarkdown` method of the editor to display the markdown content.

```tsx
import { useRef, useState } from 'react';
import { Button, Edit, SimpleForm } from 'react-admin';
import { Alert } from '@mui/material';
import { MarkdownEditorRef, MarkdownInput } from '@react-admin/ra-markdown';

export const PostEdit = () => {
    const editorRef = useRef<MarkdownEditorRef>(null);
    const [markdown, setMarkdown] = useState<string>();
    return (
        <Edit>
            <SimpleForm>
                <MarkdownInput source="body" ref={editorRef} />
                <Button
                    label="Get markdown value"
                    onClick={() =>
                        setMarkdown(
                            editorRef.current?.getInstance()?.getMarkdown()
                        )
                    }
                />
                {markdown && (
                    <Alert severity="success">Markdown: {markdown}</Alert>
                )}
            </SimpleForm>
        </Edit>
    );
};
```

**Tip**: To read or change the value of the input, prefer the form API (e.g. `useFormContext().setValue()`): the editor is updated when the form value changes.

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

## `toolbarItems`

The WYSIWYG editor displays a toolbar with all the built-in buttons by default. Use the `toolbarItems` prop to choose its buttons, and to add your own. It accepts an array of button groups, separated by a divider in the toolbar.

The built-in buttons are referenced by name: `heading`, `bold`, `italic`, `strike`, `code`, `ul`, `ol`, `task`, `link`, `image`, `table`, `codeblock`, `quote` and `hr`.

A custom button is an object with:

- `name`: a unique name
- `icon`: the content of the button, as an SVG or HTML string
- `onClick`: the function called on click. It receives the [Milkdown context](https://milkdown.dev/docs/guide/commands), to run editor commands
- `active` (optional): a function receiving the Milkdown context, returning `true` to highlight the button

The following example shows a toolbar with a few built-in buttons, and a custom button that displays an alert when clicked.

```tsx
import { Edit, SimpleForm } from 'react-admin';
import { MarkdownInput } from '@react-admin/ra-markdown';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <MarkdownInput
                source="description"
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    [
                        {
                            name: 'custom',
                            icon: '<i>Custom Button</i>',
                            onClick: () => alert('Custom Button action'),
                        },
                    ],
                ]}
            />
        </SimpleForm>
    </Edit>
);
```

**Tip**: The toolbar is only displayed in the WYSIWYG editor (and in the preview of the markdown mode), not in the markdown source.

**Tip**: `toolbarItems` is only read when the editor is created: changing it afterwards has no effect.

## `useCommandShortcut`

The editor supports keyboard shortcuts to format the content (`Mod` is `Cmd` on macOS, and `Ctrl` elsewhere):

| Shortcut                   | Command        |
| -------------------------- | -------------- |
| `Mod-b`                    | Bold           |
| `Mod-i`                    | Italic         |
| `Mod-e`                    | Inline code    |
| `Mod-Alt-x`                | Strikethrough  |
| `Mod-Shift-b`              | Blockquote     |
| `Mod-Alt-c`                | Code block     |
| `Mod-Alt-0`                | Paragraph      |
| `Mod-Alt-1` to `Mod-Alt-6` | Heading 1 to 6 |
| `Mod-Alt-7`                | Ordered list   |
| `Mod-Alt-8`                | Bullet list    |

Set `useCommandShortcut` to `false` to disable them. The other keys (e.g. `Enter`, `Tab` or undo / redo) still work.

{% raw %}
```jsx
<MarkdownInput source="description" useCommandShortcut={false} />
```
{% endraw %}

**Tip**: `useCommandShortcut` is only read when the editor is created: changing it afterwards has no effect.

## Styling

`<MarkdownInput>` renders the following CSS classes, that you can target to customize its look, e.g. with the `sx` prop of a parent component:

| Class                              | Element                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
| `RaMarkdownInput-editor`           | The editor container, including the mode tabs                     |
| `RaMarkdownInput-modeSwitch`       | The bar of mode tabs, at the bottom of the editor                 |
| `RaMarkdownInput-modeTab-markdown` | The Markdown mode tab                                             |
| `RaMarkdownInput-modeTab-wysiwyg`  | The WYSIWYG mode tab                                              |
| `milkdown`                         | The WYSIWYG editor (use `.milkdown .ProseMirror` for its content) |

The active mode tab has the `aria-pressed="true"` attribute.

{% raw %}
```jsx
<SimpleForm
    sx={{
        '& .RaMarkdownInput-editor': { borderRadius: 0 },
        '& .RaMarkdownInput-modeSwitch': { display: 'none' },
    }}
>
    <MarkdownInput source="description" />
</SimpleForm>
```
{% endraw %}

Check [the `ra-markdown` documentation](https://react-admin-ee.marmelab.com/documentation/ra-markdown) for more details.
