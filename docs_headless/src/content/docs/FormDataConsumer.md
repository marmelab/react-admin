---
title: <FormDataConsumer>
---

Edition forms often contain linked inputs, e.g. country and city (the choices of the latter depending on the value of the former).

The `<FormDataConsumer>` component gets the current (edited) values of the record and passes it to a child function.

## Usage

As `<FormDataConsumer>` uses the render props pattern, you can avoid creating an intermediate component like the `<CityInput>` component above:

```tsx
import * as React from 'react';
import { Edit, SimpleForm, SelectInput, FormDataConsumer } from 'react-admin';

const countries = ['USA', 'UK', 'France'];
const cities: Record<string, string[]> = {
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    UK: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
};
const toChoices = (items: string[]) =>
    items.map(item => ({ id: item, name: item }));

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
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
        </SimpleForm>
    </Edit>
);
```

## Hiding Inputs Based On Other Inputs

You may want to display or hide inputs based on the value of another input - for instance, show an `email` input only if the `hasEmail` boolean input has been ticked to true.

For such cases, you can use the approach described above, using the `<FormDataConsumer>` component.

```tsx
import { FormDataConsumer } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm shouldUnregister>
            <BooleanInput source="hasEmail" />
            <FormDataConsumer<{ hasEmail: boolean }>>
                {({ formData, ...rest }) =>
                    formData.hasEmail && <TextInput source="email" {...rest} />
                }
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);
```

:::note
By default, `react-hook-form` submits values of unmounted input components. In the above example, the `shouldUnregister` prop of the `<SimpleForm>` component prevents that from happening. That way, when end users hide an input, its value isn’t included in the submitted data.
:::

:::note
`shouldUnregister` should be avoided when using `<ArrayInput>` (which internally uses `useFieldArray`) as the unregister function gets called after input unmount/remount and reorder. This limitation is mentioned in the `react-hook-form` [documentation](https://react-hook-form.com/docs/usecontroller#props). If you are in such a situation, you can use the [`transform`](./EditBase.md#transform) prop to manually clean the submitted values.
:::

## Usage inside an ArrayInput

When used inside an `<ArrayInput>`, `<FormDataConsumer>` provides one additional property to its child function called scopedFormData. It’s an object containing the current values of the currently rendered item. This allows you to create dependencies between inputs inside a `<SimpleFormIterator>`, as in the following example:

```tsx
import { FormDataConsumer } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <ArrayInput source="authors">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <FormDataConsumer<{ name: string }>>
                        {({
                            formData, // The whole form data
                            scopedFormData, // The data for this item of the ArrayInput
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
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
```

:::tip
TypeScript users will notice that scopedFormData is typed as an optional parameter. This is because the `<FormDataConsumer>` component can be used outside of an `<ArrayInput>` and in that case, this parameter will be undefined. If you are inside an `<ArrayInput>`, you can safely assume that this parameter will be defined.
:::

:::tip
If you need to access the effective source of an input inside an `<ArrayInput>`, for example to change the value programmatically using setValue, you will need to leverage the [`useSourceContext`](./useSourceContext.md) hook.
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
        scopedFormData, // The data for this item of the ArrayInput
    }) => {
        /* ... */
    }}
</FormDataConsumer>
```
