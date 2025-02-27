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

You must define a `dataProvider.generateContent()` method to fetch the completion suggestions from your API. This method must return a promise that resolves to a `{ data: completionString }` object.

For instance, to use the OpenAI Completion API:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addAIMethodsBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addAIMethodsBasedOnOpenAIAPI(baseDataProvider),
```

`addAIMethodsBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to add the key to the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`)

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

Lets you pass additional parameters to the `generateContent()` query.

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

## `dataProvider.generateContent()`

In order to use the AI-powered components, your Data Provider must expose a `generateContent()` method to generate the form values for a prompt.

-   input format: `{ prompt, systemPrompt, attachments, stop, temperature, maxSize, meta }` (only the `prompt` property is required)
-   output: `Promise({ data: content })`

```jsx
dataProvider
    .generateContent({ prompt: 'Lorem ipsum' })
    .then(response => console.log(response.data));
// ' dolor sit amet, consectetur adipiscing elit.'
```

It's your responsibility to implement the `dataProvider.generateContent()` method. You can rely on an API to fetch the generated content, or use a local completion model.

If you rely on the [OpenAI Completion API](https://platform.openai.com/docs/api-reference/completions), you can use the `addAIMethodsBasedOnOpenAIAPI()` helper:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addAIMethodsBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addAIMethodsBasedOnOpenAIAPI(baseDataProvider);
```

`addAIMethodsBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to store the key in the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`).

**Tip**: A more secure way of using the OpenAI API is to add a proxy route in your API backend to the OpenAI API. That way, `generateContent` will use the same credentials as the other data provider methods, and your OpenAI API key will never transit in the browser.

If you rely on another API, you'll need to fetch it yourself.