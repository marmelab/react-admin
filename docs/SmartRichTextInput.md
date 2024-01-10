---
layout: default
title: "The SmartRichTextInput Component"
---

# `<SmartRichTextInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative to [`<RichTextInput>`](./RichTextInput.md) that allows users to quickly fix, improve, or complete the textarea content using an AI backend.

<video controls playsinline muted loop poster="https://marmelab.com/ra-enterprise/modules/assets/SmartRichTextInput.png" >
  <source src="https://marmelab.com/ra-enterprise/modules/assets/SmartRichTextInput.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<SmartRichTextInput>` adds 4 buttons on the right side of the toolbar:

-   `<AutoCorrectButton>`: Correct the misspelled words and grammar errors
-   `<RephraseButton>`: Rephrase the selection
-   `<SummarizeButton>`: Summarize the selection
-   `<ContinueButton>`: Generate more content based on the current text

The improved text is fetched from your Data Provider, using the `dataProvider.getCompletion()` method. This allows you to use any completion API, such as [OpenAI Completion API](https://beta.openai.com/docs/api-reference/completions), [Anthropic](https://console.anthropic.com/docs/api), or your own completion model.

Note that completions don't contain any HTML formatting, so the 3 first buttons will erase the formatting of the selection.

You can test this component online in the [Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-ai-input-smartrichtextinput--full-app).

## Usage

Use `<SmartRichTextInput>` instead of `<RichTextInput>` in a form. Use the `source` prop to specify the field name in the record that the input should allow to edit.

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

You must define a `dataProvider.getCompletion()` method to fetch the completion suggestions from your API. This method must return a promise that resolves to a `{ data: completionString }` object.

For instance, to use the OpenAI Completion API:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addGetCompletionBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addGetCompletionBasedOnOpenAIAPI(baseDataProvider),
```

`addGetCompletionBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to add the key to the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`)

## Props

`<SmartRichTextInput>` accepts the same props as [`<RichTextInput>`](./RichTextInput.md), as well as some additional props:

| Prop              | Required | Type       | Default | Description                                                         |
| ----------------- | -------- | ---------- | ------- | ------------------------------------------------------------------- |
| `source`          | Required | `string`   | -       | The field name in the record.                                       |
| `editorOptions`   | Optional | `Object`   | -       | Options object to pass to the underlying TipTap editor.             |
| `maxSize`         | Optional | `number`   | 256     | The maximum completion size. Usually expressed in number of tokens. |
| `meta`            | Optional | `object`   | -       | Additional parameters to pass to the completion API.                |
| `mutationOptions` | Optional | `object`   | -       | Additional options to pass to the `useMutation` hook.               |
| `locale`          | Optional | `string`   | 'en'    | The locale to use for the completion.                               |
| `stop`            | Optional | `string[]` | -       | A list of tokens where the API should stop generating.              |
| `sx`              | Optional | `SxProps`  | -       | Custom styles for the component and its children                    |
| `temperature`     | Optional | `number`   | -       | Amount of randomness injected into the response.                    |
| `toolbar`         | Optional | ReactNode  | -       | The toolbar to use. If not set, the default toolbar is used.        |

`<SmartRichTextInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `editorOptions`

You might want to add more Tiptap extensions. The `<SmartRichTextInput>` component accepts an `editorOptions` prop which is the [object passed to Tiptap Editor](https://www.tiptap.dev/guide/configuration).

If you just want to **add** extensions, don't forget to include those needed by default for our implementation. For instance, to add the [Tiptap Code Block Extension](https://tiptap.dev/api/nodes/code-block):

```jsx
import { SmartRichTextInput, DefaultEditorOptions } from '@react-admin/ra-ai';
import { CodeBlock } from '@tiptap/extension-code-block';

const editorOptions = {
    ...DefaultEditorOptions,
    extensions: [
        ...DefaultEditorOptions.extensions,
        new CodeBlock({
            HTMLAttributes: {
                class: 'ra-rich-text-code-block',
            },
        }),
    ],
};

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <SmartRichTextInput source="body" editorOptions={editorOptions} />
        </SimpleForm>
    </Edit>
);
```

## `maxSize`

Defines the maximum length of the completion. When using Large Language Models, this is the maximum number of [tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) in the completion. Defaults to 256.

```jsx
<SmartRichTextInput source="bio" maxSize={500} />
```

## `meta`

Lets you pass additional parameters to the `getCompletion()` query.

For instance, the OpenAI implementation uses the `meta` parameter as a way to adjust the completion settings:

{% raw %}
```jsx
<SmartRichTextInput
    source="body"
    meta={{
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }}
/>
```
{% endraw %}

## `mutationOptions`

`<SmartRichTextInput>` uses react-query's `useMutation`' to fetch the corrected text when users press a smart button. You can set [any of `useMutation` options](https://react-query-v3.tanstack.com/reference/useMutation) via the `mutationOptions` prop.

For instance, if you want to disable the retry on failure for this mutation, you can use:

{% raw %}
```jsx
<SmartRichTextInput source="body" mutationOptions={{ retry: false }} />
```
{% endraw %}

## `locale`

By default, the smart buttons use the current locale (or English if you don't use internationalization). But the interface locale and the content locale can be different. For instance, you may want to use French for the content, even if the interface is in English.

That's why `<SmartRichTextInput>` accepts a `locale` prop. It defaults to 'en'.

```jsx
<SmartRichTextInput source="body" locale="fr" />
```

## `source`

Specifies the field of the record that the input should edit. It is required.

{% raw %}
```jsx
<Form record={{ id: 123, title: 'Hello, world!', body: '<p>Lorem Ipsum</p>' }}>
    <SmartRichTextInput source="body" />
    {/* default value is "<p>Lorem Ipsum</p>" */}
</Form>
```
{% endraw %}

If you edit a record with a complex structure, you can use a path as the `source` parameter. For instance, if the API returns the following 'book' record:

```jsx
{
    id: 1234,
    title: 'War and Peace',
    author: {
        firstName: 'Leo',
        lastName: 'Tolstoi',
        bio: 'Leo Tolstoi is a Russian writer.'
    }
}
```

Then you can display a rich text input to edit the author's biography as follows:

```jsx
<SmartRichTextInput source="author.bio" />
```

## `stop`

List of sequences that will cause the model to stop generating completion text. The default is `["\n"]`.

```jsx
<SmartRichTextInput source="body" stop={['\n', '.']} />
```

## `sx`

The sx prop lets you style the component and its children using Material-ui's [sx syntax](https://mui.com/system/the-sx-prop/).

{% raw %}
```jsx
<SmartRichTextInput source="body" sx={{ width: 500 }} />
```
{% endraw %}

## `temperature`

Amount of randomness injected into the response. Defaults to 1. Ranges from 0 to 1. Use a temperature closer to 0 for analytical / multiple choice, and closer to 1 for creative and generative tasks.

```jsx
<SmartRichTextInput source="body" temperature={0.5} />
```

## `toolbar`

If you want to add or remove buttons, you can use the `toolbar` prop to pass your own toolbar. You will need the `<SmartEditToolbar>` component to add the 4 AI-powered buttons.

```jsx
import {
    LevelSelect,
    FormatButtons,
    ListButtons,
    LinkButtons,
    QuoteButtons,
    ClearButtons,
} from 'ra-input-rich-text';
import {
    SmartRichTextInput,
    SmartRichTextInputToolbar,
    SmartEditToolbar,
} from '@react-admin/ra-ai';

const MyRichTextInput = ({ size, ...props }) => (
    <SmartRichTextInput
        toolbar={
            <SmartRichTextInputToolbar size={size}>
                <LevelSelect />
                <FormatButtons />
                <ListButtons />
                <LinkButtons />
                <QuoteButtons />
                <ClearButtons />
                <SmartEditToolbar />
            </SmartRichTextInputToolbar>
        }
        label="Body"
        source="body"
        {...props}
    />
);
```

## `dataProvider.getCompletion()`

In order to use the AI-powered components, your Data Provider must expose a `getCompletion()` method to suggest a completion for a prompt.

-   input format: `{ prompt, stop, temperature, maxSize, meta }` (only the `prompt` property is required)
-   output: `Promise({ data: completionString })`

```jsx
dataProvider
    .getCompletion({ prompt: 'Lorem ipsum' })
    .then(response => console.log(response.data));
// ' dolor sit amet, consectetur adipiscing elit.'
```

It's your responsibility to implement the `dataProvider.getCompletion()` method. You can rely on an API to fetch the completion, or use a local completion model.

If you rely on the [OpenAI Completion API](https://platform.openai.com/docs/api-reference/completions), you can use the `addGetCompletionBasedOnOpenAIAPI()` helper:

```jsx
// in src/dataProvider.js
import jsonServerProvider from 'ra-data-json-server';
import { addGetCompletionBasedOnOpenAIAPI } from '@react-admin/ra-ai';

const baseDataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL
);
export const dataProvider = addGetCompletionBasedOnOpenAIAPI(baseDataProvider);
```

`addGetCompletionBasedOnOpenAIAPI` expects the OpenAI API key to be stored in the localStorage under the key `ra-ai.openai-api-key`. It's up to you to store the key in the localStorage (e.g. in `authProvider.login()`) and to remove it (e.g. in `authProvider.logout()`).

**Tip**: A more secure way of using the OpenAI API is to add a proxy route in your API backend to the OpenAI API. That way, `getCompletion` will use the same credentials as the other data provider methods, and your OpenAI API key will never transit in the browser.

If you rely on another API, you'll need to fetch it yourself.

## Completions For Regular Text Inputs

React-admin provides a [`<PredictiveTextInput>`](./PredictiveTextInput.md) component that uses the same completion API as `<SmartRichTextInput>`, but for regular text inputs.

<video controls autoplay playsinline muted loop>
  <source src="./img/PredictiveTextInput.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Just like `<SmartRichTextInput>`, `<PredictiveTextInput>` is part of the `ra-ai` package:

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

Check out the [`<PredictiveTextInput>` documentation](./PredictiveTextInput.md) for more details.
