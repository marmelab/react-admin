---
layout: default
title: "FormFillerButton"
---

# `<FormFillerButton>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component allows users to fill a form using an image or a camera. The image is sent to the AI backend together with the names of the fields to fill. The AI backend will extract the text from the image and fill the form.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/FormFillerButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Include that button inside a react-admin form to allow users to fill the form using an image or a camera.

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { FormFillerButton } from '@react-admin/ra-ai';

export const ContactEdit = () => (
    <Edit>
        <SimpleForm>
            <FormFillerButton />
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="company" />
            <TextInput source="email" />
        </SimpleForm>
    </Edit>
);
```

**Tip**: `<FormFillerButton>` requires a model with Vision capabilities to extract text from images. We recommend using OpenAI's `gpt-4o-mini` or `gpt-4o` models.

## Props

`<FormFillerButton>` accepts the following props:

| Prop              | Required | Type     | Default   | Description                                                                                                             |
| ----------------- | -------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `acceptedFileTypes` | Optional | string   | 'image/*' | The accepted file types for the 'image' filler. |
| `allowOverride`    | Optional | boolean  | false     | Allow the button to override the filled values. |
| `fields`          | Optional | Object |        | The description of the fields to fill. This helps the AI to understand the context of the form. |
| `maxDimension`        | Optional | number   | 1000      | The maximum width and height of the image. The image will be resized to fit this  dimension. |
| `meta`            | Optional | object   | -         | Additional parameters to pass to the completion API. |
| `sources`    | Optional | `string[]` | `['image', 'camera']` | The sources to use. Can be 'image' and/or 'camera'. |
| `ButtonGroupProps` | Optional | object   | -         | Props to pass to the ButtonGroup component. |
| `DialogProps`    | Optional | object   | -         | Props to pass to the Dialog component. |

## `acceptedFileTypes`

The accepted file types for the 'image' filler. Defaults to 'image/*'.

```tsx
<FormFillerButton acceptedFileTypes="image/jpeg" />
```

## `allowOverride`

Allow the button to override the filled values. Defaults to false.

```tsx
<FormFillerButton allowOverride />
```

## `fields`

The description of the fields to fill. This helps the AI to understand the context of the form.

{% raw %}
```tsx
<FormFillerButton
    fields={{
        company: 'The company name. Example: Acme Inc.',
        email: 'User email. If more than one email is present, find the one @acme.com',
    }}
/>
```
{% endraw %}

## `maxDimension`

The maximum width and height of the image. The image will be resized to fit this dimension. Defaults to 1000.

Larger dimensions improve the OCR quality but increase the processing time.

```tsx
<FormFillerButton maxDimension={1500} />
```

## `meta`

Lets you pass additional parameters to the `getCompletion()` query.

For instance, the OpenAI implementation uses the `meta` parameter as a way to adjust the completion settings:

{% raw %}
```tsx
<FormFillerButton
    meta={{
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }}
/>
```
{% endraw %}

## `sources`

The sources to use. The value must be an array. Possible values are 'image' and 'camera'. Defaults to `['image', 'camera']`.

If you set only one source, the button will be a simple button instead of a split button.

{% raw %}
```tsx
<FormFillerButton sources={['image']} />
```
{% endraw %}

If you set more than one source, the first item will be the default source.

{% raw %}
```tsx
<FormFillerButton sources={['camera', 'image']} />
```
{% endraw %}

## `ButtonGroupProps`

Props to pass to the ButtonGroup component.

{% raw %}
```tsx
<FormFillerButton ButtonGroupProps={{ variant: 'contained' }} />
```
{% endraw %}

## `DialogProps`

Props to pass to the Dialog component.

{% raw %}
```tsx
<FormFillerButton DialogProps={{ maxWidth: 'md' }} />
```
{% endraw %}
