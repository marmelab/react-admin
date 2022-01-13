---
layout: default
title: "SimpleShowLayout"
---

# `<SimpleShowLayout>`

The `<SimpleShowLayout>` pulls the `record` from the `RecordContext`. It renders the record fields in a single-column layout (via material-ui's `<Stack>` component). `<SimpleShowLayout>` delegates the actual rendering of fields to its children. It wraps each field inside [a `<FieldWithLabel>` component](./FieldWithLabel.md) to add a label.

## Usage

Use `<SimpleShowLayout>` as descendent of a `<Show>` component (or any component creating a `<RecordContext>`), and set the fields to be displayed as children:

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <RichTextField source="body" />
            <NumberField source="nb_views" />
        </SimpleShowLayout>
    </Show>
);
```

## Props

* [`children`](#fields): components rendering a record field
* `className`: passed to the root component
* [`divider`](#divider): optional element to render between each field
* [`record`](#controlled-mode): can be injected when outside a RecordContext 
* [`spacing`](#spacing): optional integer to set the spacing between the fields
* [`sx`](#css-api): Override the styles

Additional props are passed to the root component (`<div>`).

## Fields

`<SimpleShowLayout>` renders each child inside a `<FieldWithLabel>` component. The above snippet roughly translates to:

```jsx
const PostShow = () => (
    <Show>
        <Stack>
            <FieldWithLabel label="Title">
                <TextField source="title" />
            </FieldWithLabel>
            <FieldWithLabel label="Body">
                <RichTextField source="body" />
            </FieldWithLabel>
            <FieldWithLabel label="Nb Views">
                <NumberField source="nb_views" />
            </FieldWithLabel>
        </Stack>
    </Show>
);
```

The `<FieldWithLabel label>` uses the humanized source by default. You can customize it by passing a `label` prop to the fields:

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField label="My Custom Title" source="title" />
            <TextField label="my.custom.translationKey" source="description" />
        </SimpleShowLayout>
    </Show>
);

// translates to
const PostShow = () => (
    <Show>
        <Stack>
            <FieldWithLabel label="My Custom Title">
                <TextField source="title" />
            </FieldWithLabel>
        </Stack>
    </Show>
);
```

You can disable the `<FieldWithLabel>` decoration by passing setting `label={false}` on a field:

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField label={false} source="title" />
        </SimpleShowLayout>
    </Show>
);

// translates to
const PostShow = () => (
    <Show>
        <Stack>
            <TextField source="title" />
        </Stack>
    </Show>
);
```

`<SimpleShowLayout>` children can be anything you want. Try passing your own components:

```jsx
const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post "{record.title}"</span>;
};

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <PostTitle label="title" />
        </SimpleShowLayout>
    </Show>
);
```

## Spacing

`<SimpleShowLayout>` renders a material-ui `<Stack>`. You can customize the spacing of each row by passing a `spacing` prop:

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout spacing={2}>
            <PostTitle label="title" />
        </SimpleShowLayout>
    </Show>
);
```

The default spacing is `1`.

## Divider

`<Stack>` accepts an optional `divider` prop - a component rendered between each row. `<SimpleShowLayout>` also accepts this props, and passes it to the `<Stack>` component.

```jsx
import { Divider } from '@mui/material';

const PostShow = () => (
    <Show>
        <SimpleShowLayout divider={<Divider flexItem />}>
            <PostTitle label="title" />
        </SimpleShowLayout>
    </Show>
);
```

## More Than One Column

`<SimpleShowLayout>` arranges fields with labels in a single column. If you need more than one column, nothing prevents you from using this layout several times:

```jsx
const BookShow = () => (
    <Show>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="title" />
                </SimpleShowLayout>
            </Grid>
            <Grid item xs={6}>
                <SimpleShowLayout>
                    <TextField source="author" />
                    <TextField source="summary" />
                    <NumberField source="year" />
                </SimpleShowLayout>
            </Grid>
        </Grid>
    </Show>
);
```

## Controlled Mode

By default, `<SimpleShowLayout>` reads the record from the `ResourceContext`. But by passing a `record` prop, you can render the component outside a `ResourceContext`.

{% raw %}
```jsx
const StaticPostShow = () => (
    <SimpleShowLayout record={{ id: 123, title: 'Hello world' }}>
        <TextField source="title" />
    </SimpleShowLayout>
);
```
{% endraw %}

When passed a `record`, `<SimpleShowLayout>` creates a `RecordContext` with the given record.

## `sx`: CSS API

The `<SimpleShowLayout>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                     | Description                                             |
|-------------------------------|---------------------------------------------------------|
| `& .RaSimpleShowLayout.stack` | Applied to the `<Stack>` element                        |
| `& .RaSimpleShowLayout.row`   | Applied to each child of the stack (i.e. to each field) |

To override the style of all instances of `<SimpleShowLayout>` using the [material-ui style overrides](https://mui.com/customization/theme-components/), use the `RaSimpleShowLayout` key.

## See Also

* [Field components](./Fields.md)
* [Show Guesser](./ShowGuesser.md) guesses the fields based on the record type
* [TabbedShowLayout](./TabbedShowLayout.md) provides a more complex layout with tabs

## API

* [`<SimpleShowLayout>`]
* [`<FieldWithLabel>`]
* [`useRecordContext`]

[`<SimpleShowLayout>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/SimpleShowLayout.tsx
[`<FieldWithLabel>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/FieldWithLabel.tsx
[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/useRecordContext.ts
