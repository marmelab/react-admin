---
layout: default
title: "The TextArrayInput Component"
---

# `<TextArrayInput>`

`<TextArrayInput>` lets you edit an array of strings, like a list of email addresses or a list of tags. It renders as an input where the current values are represented as chips. Users can add or delete new values. 

<video controls autoplay playsinline muted loop>
  <source src="./img/TextArrayInput.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

Use `<TextArrayInput>` to edit an array of strings:

```jsx
import { Create, SimpleForm, TextArrayInput, TextInput } from 'react-admin';

export const EmailCreate = () => (
    <Create>
        <SimpleForm>
            <TextArrayInput source="to" />
            <TextInput source="subject" />
            <TextInput source="body" multiline minRows={5} />
        </SimpleForm>
    </Create>
);
```

This form will allow users to input multiple email addresses in the `to` field. The resulting email will look like this:

```jsx
{
    "to": ["jane.smith@example.com", "john.doe@acme.com"],
    "subject": "Request for a quote",
    "body": "Hi,\n\nI would like to know if you can provide a quote for the following items:\n\n- 100 units of product A\n- 50 units of product B\n- 25 units of product C\n\nBest regards,\n\nJulie\n",
    "id": 123,
    "date": "2024-11-26T11:37:22.564Z",
    "from": "julie.green@example.com",
}
```

`<TextArrayInput>` is designed for simple string arrays. For more complex use cases, consider the following alternatives:

- [`<SelectArrayInput>`](./SelectArrayInput.md) or [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md) if the possible values are limited to a predefined list.
- [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) if the possible values are stored in another resource.
- [`<ArrayInput>`](./ArrayInput.md) if the stored value is an array of *objects* instead of an array of strings.

## Props

| Prop         | Required | Type      | Default | Description                                                          |
| ------------ | -------- | --------- | ------- | -------------------------------------------------------------------- |
| `options`    | Optional | `string[]` |  | Optional list of possible values for the input. If provided, the input will suggest these values as the user types. |
| `renderTags` | Optional | `(value, getTagProps) => ReactNode` | | A function to render selected value. |

`<TextArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

Additional props are passed down to the underlying Material UI [`<Autocomplete>`](https://mui.com/material-ui/react-autocomplete/) component.

## `options`

You can make show a list of suggestions to the user by setting the `options` prop:

```jsx
<TextArrayInput
    source="to"
    options={[
        'john.doe@example.com',
        'jane.smith@example.com',
        'alice.jones@example.com',
        'bob.brown@example.com',
        'charlie.davis@example.com',
        'david.evans@example.com',
        'emily.frank@example.com',
        'frank.green@example.com',
        'grace.harris@example.com',
        'henry.ivan@example.com',
    ]}
/>
```

## `renderTags`

To customize the rendering of the chips, use the `renderTags` prop. This prop is a function that takes two arguments: 

- `value`: The input value (an array of strings)
- `getTagProps`: A props getter for an individual tag.

```tsx
<TextArrayInput
    source="to"
    renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
                <Chip
                    variant="outlined"
                    label={option}
                    key={key}
                    {...tagProps}
                />
            );
        })
    }
/>
```