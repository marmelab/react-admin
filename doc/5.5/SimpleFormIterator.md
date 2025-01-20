---
layout: default
title: "SimpleFormIterator"
---

# `<SimpleFormIterator>`

This component provides a UI for editing arrays of objects, one row per object.

<video controls autoplay playsinline muted loop>
  <source src="./img/array-input.webm" type="video/webm"/>
  <source src="./img/array-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

`<SimpleFormIterator>` lets users edit, add, remove and reorder sub-records. It is designed to be used as a child of [`<ArrayInput>`](./ArrayInput.md) or [`<ReferenceManyInput>`](./ReferenceManyInput.md). You can also use it within an `ArrayInputContext` containing a *field array*, i.e. the value returned by [react-hook-form's `useFieldArray` hook](https://react-hook-form.com/docs/usefieldarray).

## Usage

`<SimpleFormIterator>` requires no prop by default. It expects an array of inputs as children. It renders these inputs once per row and takes care of setting a different source for each row.

```jsx
import { 
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    ArrayInput,
    NumberInput,
    SimpleFormIterator
} from 'react-admin';

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="customer" />
            <DateInput source="date" />
            <ArrayInput source="items">
                <SimpleFormIterator inline>
                    <TextInput source="name" helperText={false} />
                    <NumberInput source="price" helperText={false} />
                    <NumberInput source="quantity" helperText={false} />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
```

In the example above, the inputs for each row appear inline, with no helper text. This dense layout is adapted to arrays with many items. If you need more room, omit the `inline` prop to use the default layout, where each input is displayed in a separate row.

```jsx
const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="customer" />
            <DateInput source="date" />
            <ArrayInput source="items">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <NumberInput source="price" />
                    <NumberInput source="quantity" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
```

![Simple form iterator block](./img/array-input-block.webp)

## Props

| Prop     | Required | Type           | Default               | Description                         |
|----------|----------|----------------|-----------------------|-------------------------------------|
| `addButton` | Optional | `ReactElement` | - | Component to render for the add button |
| `children` | Optional | `ReactElement` | - | List of inputs to display for each row |
| `className` | Optional | `string` | - | Applied to the root element (`<ul>`) |
| `disableAdd` | Optional | `boolean` | `false` | When true, the user cannot add new rows |
| `disableClear` | Optional | `boolean` | `false` | When true, the user cannot clear the array |
| `disableRemove` | Optional | `boolean` | `false` | When true, the user cannot remove rows |
| `disableReordering` | Optional | `boolean` | `false` | When true, the user cannot reorder rows |
| `fullWidth` | Optional | `boolean` | `true` | Set to false to glue the actions to last input |
| `getItemLabel` | Optional | `function` | `x => x` | Callback to render the label displayed in each row |
| `inline` | Optional | `boolean` | `false` | When true, inputs are put on the same line |
| `removeButton` | Optional | `ReactElement` | - | Component to render for the remove button |
| `reOrderButtons` | Optional | `ReactElement` | - | Component to render for the up / down button |
| `disabled` | Optional | `boolean` | `false` | If true, all buttons are disabled. |
| `sx` | Optional | `SxProps` | - | Material UI shortcut for defining custom styles |

## `addButton`

This prop lets you pass a custom element to replace the default Add button. 

```jsx
<SimpleFormIterator addButton={<MyAddButton label={"Add a line"} />}>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

You need to provide an element that triggers the `add` function from `useSimpleFormIterator` when clicked. Here is an example:

```jsx
import { ButtonProps, useSimpleFormIterator, useTranslate } from "react-admin";
import React from "react";
import Button from "@mui/material/Button";

export const MyAddButton = (props: ButtonProps) => {
    const { add } = useSimpleFormIterator();
    const translate = useTranslate();

    return (
        <Button onClick={() => add()} {...props}>
            {translate(props.label ?? 'ra.action.add')}
        </Button>
    );
};
```

## `children`

A list of Input elements, that will be rendered on each row. 

```jsx
<SimpleFormIterator>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

By default, `<SimpleFormIterator>` renders one input per line, but they can be displayed inline with the `inline` prop.

`<SimpleFormIterator>` also accepts `<FormDataConsumer>` as child. In this case, `<FormDataConsumer>` provides one additional property to its child function called `scopedFormData`. It's an object containing the current values of the *currently rendered item*. This allows you to create dependencies between inputs inside a `<SimpleFormIterator>`, as in the following example:

```jsx
import { FormDataConsumer } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <ArrayInput source="authors">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <FormDataConsumer>
                        {({
                            formData, // The whole form data
                            scopedFormData, // The data for this item of the ArrayInput
                        }) =>
                            scopedFormData && scopedFormData.name ? (
                                <SelectInput
                                    source="role" // Will translate to "authors[0].role"
                                    choices={[{ id: 1, name: 'Head Writer' }, { id: 2, name: 'Co-Writer' }]}
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

**Tip:** TypeScript users will notice that `scopedFormData` is typed as an optional parameter. This is because the `<FormDataConsumer>` component can be used outside of an `<ArrayInput>` and in that case, this parameter will be `undefined`. If you are inside an `<ArrayInput>`, you can safely assume that this parameter will be defined.

**Note**: `<SimpleFormIterator>` only accepts `Input` components as children. If you want to use some `Fields` instead, you have to use a `<FormDataConsumer>`, as follows:

```jsx
import { ArrayInput, SimpleFormIterator, DateInput, TextField, FormDataConsumer, Labeled } from 'react-admin';

<ArrayInput source="backlinks">
    <SimpleFormIterator disableRemove>
        <DateInput source="date" />
        <FormDataConsumer>
            {({ scopedFormData }) => (
                <Labeled label="Url">
                    <TextField source="url" record={scopedFormData} />
                </Labeled>
            )}
        </FormDataConsumer>
    </SimpleFormIterator>
</ArrayInput>
```

## `className`

CSS classes passed to the root component. 

```jsx
<SimpleFormIterator className="dummy">
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

**Note**: To customize field styles, prefer [the `sx` prop](#sx).

## `disableAdd`

When true, the Add button isn't rendered, so users cannot add new rows.

```jsx
<SimpleFormIterator disableAdd>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

## `disableClear`

When true, the array clear button isn't rendered, so the user cannot clear the array.

```jsx
<SimpleFormIterator disableClear>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```


## `disableRemove`

When true, the Remove buttons aren't rendered, so users cannot remove existing rows.

```jsx
<SimpleFormIterator disableRemove>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

## `disableReordering`

When true, the up and down buttons aren't rendered, so the user cannot reorder rows.

```jsx
<SimpleFormIterator disableReordering>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
``` 

## `fullWidth`

By default, the row actions appear at the end of the row.

![SimpleFormIterator full width](./img/simple-form-iterator-fullWidth.png)

If your form is narrow, you can set the `fullWidth` prop to `false` to make the row actions appear at the end of the form.

```jsx
<SimpleFormIterator fullWidth={false}>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

![SimpleFormIterator default width](./img/simple-form-iterator-fullWidth-false.png)

## `getItemLabel`

`<SimpleFormIterator>` can add a label in front of each row, based on the row index. Set the `getItemLabel` prop with a callback to enable this feature.

```jsx
<SimpleFormIterator getItemLabel={index => `#${index + 1}`}>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

![SimpleFormIterator with iterm label](./img/array-input-item-label.png)

## `inline`

When true, inputs are put on the same line. Use this option to make the lines more compact, especially when the children are narrow inputs. 

```jsx
<SimpleFormIterator inline>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

![Inline form iterator](./img/simple-form-iterator-inline.webp)

Without this prop, `<SimpleFormIterator>` will render one input per line.

```jsx
<SimpleFormIterator>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

![Not Inline form iterator](./img/simple-form-iterator-not-inline.webp)

## `removeButton`

This prop lets you pass a custom element to replace the default Remove button. 

```jsx
<SimpleFormIterator removeButton={<MyRemoveButton label="Remove this line" />}>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

You need to provide an element that triggers the `remove` function from `useSimpleFormIteratorItem` when clicked. Here is an example:

```jsx
import * as React from 'react';
import clsx from 'clsx';
import { ButtonProps, useSimpleFormIteratorItem, useTranslate } from "react-admin";
import Button from "@mui/material/Button";

export const MyRemoveButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { remove } = useSimpleFormIteratorItem();
    const translate = useTranslate();

    return (
        <Button
            onClick={() => remove()}
            color="warning"
            {...props}
        >
            {translate(props.label ?? 'ra.action.remove')}
        </Button>
    );
};
```

## `reOrderButtons`

This prop lets you pass a custom element to replace the default Up and Down buttons. This custom element must use the `useSimpleFormIteratorItem` hook to access the current row index and reorder callback.

```jsx
const ReOrderButtons = () => {
    const { index, total, reOrder } = useSimpleFormIteratorItem();

    return (
        <>
            <IconButton
                size="small"
                onClick={() => reOrder(index - 1)}
                disabled={index <= 0}
            >
                <ArrowUpwardIcon />
            </IconButton>
            <IconButton
                size="small"
                onClick={() => reOrder(index + 1)}
                disabled={total == null || index >= total - 1}
            >
                <ArrowDownwardIcon />
            </IconButton>
        </>
    );
};

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="customer" />
            <DateInput source="date" />
            <ArrayInput source="items">
                <SimpleFormIterator reOrderButtons={<ReOrderButtons />}>
                    <TextInput source="name" />
                    <NumberInput source="price" />
                    <NumberInput source="quantity" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
```

## `readOnly`

The `readOnly` prop set to true makes the children input not mutable, meaning the user can not edit them.

```jsx
<SimpleFormIterator readOnly>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

Contrary to disabled controls, read-only controls are still focusable and are submitted with the form.

## `disabled`

The `disabled` prop set to true makes the children input not mutable, focusable, or even submitted with the form.

```jsx
<SimpleFormIterator disabled>
    <TextInput source="name" />
    <NumberInput source="price" />
    <NumberInput source="quantity" />
</SimpleFormIterator>
```

Contrary to read-only controls, disabled controls can not receive focus and are not submitted with the form.

## `sx`

You can override the style of the root element (a `<div>` element) as well as those of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples).

This property accepts the following subclasses:

| Rule name                | Description                                               |
|--------------------------|-----------------------------------------------------------|
| `RaSimpleFormIterator-action`         | Applied to the action zone on each row (the one containing the Remove button) |
| `RaSimpleFormIterator-add`            | Applied to the bottom line containing the Add button |
| `RaSimpleFormIterator-form`           | Applied to the subform on each row |
| `RaSimpleFormIterator-index`          | Applied to the row label when `getItemLabel` is set |
| `RaSimpleFormIterator-inline`         | Applied to rows when `inline` is true |
| `RaSimpleFormIterator-line`           | Applied to each row |
| `RaSimpleFormIterator-list`           | Applied to the `<ul>` element |
