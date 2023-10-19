---
layout: default
title: "The RichTextInput Component"
---

# `<RichTextInput>`

`<RichTextInput>` lets users edit rich text in a WYSIWYG editor, and store the result as HTML. It is powered by [TipTap](https://www.tiptap.dev/).

<video controls autoplay playsinline muted loop>
  <source src="./img/rich-text-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

Due to its size, `<RichTextInput>` is not bundled by default with react-admin. You must install it first, using npm:

```sh
npm install ra-input-rich-text
# or
yarn add ra-input-rich-text
```

Use it as you would any react-admin inputs:

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

export const PostEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput source="title" />
			<RichTextInput source="body" />
		</SimpleForm>
	</Edit>
);
```

## Props

| Prop   | Required | Type     | Default | Description |
| ------ | -------- | -------- | ------- | ----------- |
| `editorOptions` | Optional | `Object` | - | Options object to pass to the underlying TipTap editor. |
| `toolbar` | Optional| ReactNode | - | The toolbar to use. If not set, the default toolbar is used. |

`<RichTextInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `editorOptions`

You might want to add more Tiptap extensions. The `<RichTextInput>` component accepts an `editorOptions` prop which is the [object passed to Tiptap Editor](https://www.tiptap.dev/guide/configuration).

If you just want to **add** extensions, don't forget to include those needed by default for our implementation. Here's an example to add the [HorizontalRule node](https://www.tiptap.dev/api/nodes/horizontal-rule):

```jsx
import {
    DefaultEditorOptions,
    RichTextInput,
    RichTextInputToolbar,
    LevelSelect,
    FormatButtons,
    AlignmentButtons,
    ListButtons,
    LinkButtons,
    QuoteButtons,
    ClearButtons,
    useTiptapEditor,  
} from 'ra-input-rich-text';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Remove from '@mui/icons-material/Remove';
import { ToggleButton } from '@mui/material';

const MyRichTextInputToolbar = ({ size, ...props }) => {
    const editor = useTiptapEditor();
  
    return (
        <RichTextInputToolbar {...props}>
            <LevelSelect size={size} />
            <FormatButtons size={size} />
            <AlignmentButtons size={size} />
            <ListButtons size={size} />
            <LinkButtons size={size} />
            <QuoteButtons size={size} />
            <ClearButtons size={size} />
            <ToggleButton
                aria-label="Add an horizontal rule"
                title="Add an horizontal rule"
                value="left"
                onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                }
                selected={editor && editor.isActive('horizontalRule')}
            >
                <Remove fontSize="inherit" />
            </ToggleButton>
        </RichTextInputToolbar>
    );
}

const MyRichTextInput = ({ size, ...props }) => (
    <RichTextInput
        editorOptions={MyEditorOptions}
        toolbar={<MyRichTextInputToolbar size={size} />}
        label="Body"
        source="body"
        {...props}
    />
);

export const MyEditorOptions = {
	...DefaultEditorOptions,
	extensions: [
		...DefaultEditorOptions.extensions,
        HorizontalRule,
	],
};
```

## `toolbar`

The `<RichTextInput>` component has a `toolbar` prop that accepts a `ReactNode`. But default, it uses the `<RichTextInputToolbar>` component.

You can leverage the `tollbar` prop to change the buttons size:

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';

export const PostEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput source="title" />
			<RichTextInput source="body" toolbar={<RichTextInputToolbar size="large" />} />
		</SimpleForm>
	</Edit>
);
```

Or to remove some prebuilt components like the `<AlignmentButtons>`:

```jsx
import {
	RichTextInput,
	RichTextInputToolbar,
	LevelSelect,
	FormatButtons,
	ListButtons,
	LinkButtons,
	QuoteButtons,
	ClearButtons,
} from 'ra-input-rich-text';

const MyRichTextInput = ({ size, ...props }) => (
	<RichTextInput
		toolbar={
			<RichTextInputToolbar>
				<LevelSelect size={size} />
				<FormatButtons size={size} />
				<ListButtons size={size} />
				<LinkButtons size={size} />
				<QuoteButtons size={size} />
				<ClearButtons size={size} />
			</RichTextInputToolbar>
		}
		label="Body"
		source="body"
		{...props}
	/>
);
```

## AI Writing Assistant

Modern AI tools can be a great help for editors. React-admin proposes an AI-powered writing assistant for the `<RichTextInput>` component, called [`<SmartRichTextInput>`](./SmartRichTextInput.md):

<video controls playsinline muted loop poster="https://marmelab.com/ra-enterprise/modules/assets/SmartRichTextInput.png" >
  <source src="https://marmelab.com/ra-enterprise/modules/assets/SmartRichTextInput.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<SmartRichTextInput>` is a drop-in replacement for `<RichTextInput>`: 

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { SmartRichTextInput } from '@react-admin/ra-ai';

export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <SmartRichTextInput source="body" />
        </SimpleForm>
    </Edit>
);
```

`<SmartRichTextInput>` is available as part of the [ra-ai](https://marmelab.com/ra-enterprise/modules/ra-ai) enterprise package.

## Lazy Loading

The `<RichTextInput>` component depends on TipTap, which in turns depends on ProseMirror. Together, these libraries represent about 120kB of minified JavaScript. If you don't use `<RichTextInput>` on all your forms, you can [lazy load](https://react.dev/reference/react/lazy#suspense-for-code-splitting) it to reduce the size of your bundle.

To do so, replace the import:

```jsx
import { RichTextInput } from 'ra-input-rich-text';
```

with a dynamic import:

```jsx
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);
```

Once compiled, your application will load the `<RichTextInput>` only when needed.