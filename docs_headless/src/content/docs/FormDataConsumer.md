---
title: <FormDataConsumer>
---

Edition forms often contain linked inputs, e.g. country and city (the choices of the latter depending on the value of the former).

The `<FormDataConsumer>` component gets the current (edited) values of the record and passes it to a child function.

## Usage

As `<FormDataConsumer>` uses the render props pattern, you can avoid creating an intermediate component like the `<CityInput>` component above:

```tsx
import * as React from 'react';
import { EditBase, Form, FormDataConsumer } from 'ra-core';
import { SelectInput } from 'my-ui-library';

const countries = ['USA', 'UK', 'France'];
const cities: Record<string, string[]> = {
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    UK: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
};
const toChoices = (items: string[]) =>
    items.map(item => ({ id: item, name: item }));

const OrderEdit = () => (
    <EditBase>
        <Form>
            <SelectInput source="country" choices={toChoices(countries)} />
            <FormDataConsumer<{ country: string }>>
                {({ formData, ...rest }) => (
                    <SelectInput
                        source="cities"
                        choices={
                            formData.country
                                ? toChoices(cities[formData.country])
                                : []
                        }
                        {...rest}
                    />
                )}
            </FormDataConsumer>
        </Form>
    </EditBase>
);
```

## Hiding Inputs Based On Other Inputs

You may want to display or hide inputs based on the value of another input - for instance, show an `email` input only if the `hasEmail` boolean input has been ticked to true.

For such cases, you can use the approach described above, using the `<FormDataConsumer>` component.

```tsx
import { EditBase, Form, FormDataConsumer } from 'ra-core';
import { BooleanInput, TextInput } from 'my-ui-library';

const PostEdit = () => (
    <EditBase>
        <Form shouldUnregister>
            <BooleanInput source="hasEmail" />
            <FormDataConsumer<{ hasEmail: boolean }>>
                {({ formData, ...rest }) =>
                    formData.hasEmail && <TextInput source="email" {...rest} />
                }
            </FormDataConsumer>
        </Form>
    </EditBase>
);
```

:::note
By default, `react-hook-form` submits values of unmounted input components. In the above example, the `shouldUnregister` prop of the `<Form>` component prevents that from happening. That way, when end users hide an input, its value isn’t included in the submitted data.
:::

:::note
Setting [`shouldUnregister`](https://react-hook-form.com/docs/useform#shouldUnregister) on a form should be avoided when using `<ArrayInputBase>` (which internally uses `useFieldArray`) as the unregister function gets called after input unmount/remount and reorder. This limitation is mentioned in the `react-hook-form` [documentation](https://react-hook-form.com/docs/usecontroller#props). If you are in such a situation, you can use the [`transform`](./EditBase.md#transform) prop to manually clean the submitted values.
:::

## Usage inside an ArrayInput

When used inside an `<ArrayInputBase>`, `<FormDataConsumer>` provides one additional property to its child function called `scopedFormData`. It’s an object containing the current values of the currently rendered item. This allows you to create dependencies between inputs inside a form iterator (e.g. one built with [`<SimpleFormIteratorBase>`](./SimpleFormIteratorBase.md)), as in the following example:

```tsx
import { EditBase, Form, ArrayInputBase, FormDataConsumer } from 'ra-core';
import { TextInput, SelectInput, SimpleFormIterator } from 'my-ui-library';

const PostEdit = () => (
    <EditBase>
        <Form>
            <ArrayInputBase source="authors">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <FormDataConsumer<{ name: string }>>
                        {({
                            formData, // The whole form data
                            scopedFormData, // The data for this item of the ArrayInputBase
                            ...rest
                        }) =>
                            scopedFormData && scopedFormData.name ? (
                                <SelectInput
                                    source="role" // Will translate to "authors[0].role"
                                    choices={[
                                        { id: 1, name: 'Head Writer' },
                                        { id: 2, name: 'Co-Writer' },
                                    ]}
                                    {...rest}
                                />
                            ) : null
                        }
                    </FormDataConsumer>
                </SimpleFormIterator>
            </ArrayInputBase>
        </Form>
    </EditBase>
);
```

:::tip
TypeScript users will notice that scopedFormData is typed as an optional parameter. This is because the `<FormDataConsumer>` component can be used outside of an `<ArrayInputBase>` and in that case, this parameter will be undefined. If you are inside an `<ArrayInputBase>`, you can safely assume that this parameter will be defined.
:::

:::tip
If you need to access the effective source of an input inside an `<ArrayInputBase>`, for example to change the value programmatically using `setValue`, you will need to leverage the [`useSourceContext`](./useSourceContext.md) hook.
:::

## Props

| Prop       | Required | Type       | Default | Description                                                    |
| ---------- | -------- | ---------- | ------- | -------------------------------------------------------------- |
| `children` | Required | `function` | -       | A function that takes the `formData` and returns a `ReactNode` |

## `children`

The function used to render a component based on the `formData`.

```tsx
<FormDataConsumer<{ name: string }>>
    {({
        formData, // The whole form data
        scopedFormData, // The data for this item of the ArrayInputBase
    }) => {
        /* ... */
    }}
</FormDataConsumer>
```
