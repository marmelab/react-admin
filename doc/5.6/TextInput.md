---
layout: default
title: "The TextInput Component"
---

# `<TextInput>`

`<TextInput>` is the most common input. It is used for texts, emails, URL or passwords. In translates into [a Material UI `<TextField>`](https://mui.com/material-ui/react-text-field/), and renders as `<input type="text">` in HTML.

<video controls autoplay playsinline muted loop>
  <source src="./img/text-input.webm" type="video/webm"/>
  <source src="./img/text-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

```jsx
import { Edit, SimpleForm, TextInput, required } from 'react-admin';

export const PostEdit = () => (
    <Edit title={<PostTitle />}>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />
            <TextInput source="teaser" validate={[required()]} defaultValue="Lorem Ipsum" multiline />
        </SimpleForm>
    </Edit>
);
```

## Props

| Prop         | Required | Type      | Default | Description                                                          |
| ------------ | -------- | --------- | ------- | -------------------------------------------------------------------- |
| `multiline`  | Optional | `boolean` | `false` | If `true`, the input height expands as the text wraps over several lines |
| `resettable` | Optional | `boolean` | `false` | If `true`, display a button to reset the changes in this input value |
| `type`       | Optional | `string`  | `text`  | Type attribute passed to the `<input>` element                       |

`<TextInput>` also accepts the [common input props](./Inputs.md#common-input-props).

Additional props are passed down to the underlying Material UI [`<TextField>`](https://mui.com/material-ui/react-text-field/) component.

## `multiline`

You can make the `<TextInput>` expandable using the `multiline` prop for multiline text values. It renders as an auto expandable textarea.

```jsx
<TextInput multiline source="body" />
```

## `resettable`

You can make the `<TextInput>` component resettable using the `resettable` prop. This will add a reset button which will be displayed only when the field has a value and is focused.

```jsx
import { TextInput } from 'react-admin';

<TextInput source="title" resettable />
```

<video controls autoplay playsinline muted loop>
  <source src="./img/resettable-text-input.webm" type="video/webm"/>
  <source src="./img/resettable-text-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## `type`

You can choose a specific input type using the `type` attribute, for instance `text` (the default), `email`, `url`, or `password`:

```jsx
<TextInput label="Email Address" source="email" type="email" />
```

**Warning**: Do not use `type="number"`, or you'll receive a string as value (this is a [known React bug](https://github.com/facebook/react/issues/1425)). Instead, use [`<NumberInput>`](./NumberInput.md).

## Rich Text

If you want to let users edit rich text, use [`<RichTextInput>`](./RichTextInput.md) instead. This component leverages [TipTap](https://www.tiptap.dev/) to provide a WYSIWYG editor.

<video controls autoplay playsinline muted loop>
  <source src="./img/rich-text-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

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

See [the `<RichTextInput>` documentation](./RichTextInput.md) for more details.

## Predictive Text Input

An alternative to `<TextInput>` is [`<PredictiveTextInput>`](./PredictiveTextInput.md), which suggests completion for the input value, using your favorite AI backend. Users can accept the completion by pressing the `Tab` key. It's like Intellisense or Copilot for your forms.

<video controls autoplay playsinline muted loop>
  <source src="./img/PredictiveTextInput.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Use `<PredictiveTextInput>` instead of `<TextInput>` in your forms:

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { PredictiveTextInput } from '@react-admin/ra-ai';

const PersonEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="company" />
            <PredictiveTextInput source="email" />
            <PredictiveTextInput source="website" />
            <PredictiveTextInput source="bio" multiline />
        </SimpleForm>
    </Edit>
);
```

See the [dedicated documentation](./PredictiveTextInput.md) for more details.
