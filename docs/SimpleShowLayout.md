---
layout: default
title: "SimpleShowLayout"
---

# `<SimpleShowLayout>`

The `<SimpleShowLayout>` pulls the `record` from the `RecordContext`. It renders the record fields in a single-column layout (via Material UI's `<Stack>` component). `<SimpleShowLayout>` delegates the actual rendering of fields to its children. It wraps each field inside [a `<Labeled>` component](./Labeled.md) to add a label.

![Simple Show Layout](./img/post-show.png)

## Usage

Use `<SimpleShowLayout>` as descendant of a `<Show>` component (or any component creating a `<RecordContext>`), and set the fields to be displayed as children:

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
* [`sx`](#sx-css-api): Override the styles

Additional props are passed to the root component (`<div>`).

## `children`

`<SimpleShowLayout>` renders each child inside a `<Labeled>` component. The above snippet roughly translates to:

```jsx
const PostShow = () => (
    <Show>
        <Stack>
            <Labeled label="Title">
                <TextField source="title" />
            </Labeled>
            <Labeled label="Body">
                <RichTextField source="body" />
            </Labeled>
            <Labeled label="Nb Views">
                <NumberField source="nb_views" />
            </Labeled>
        </Stack>
    </Show>
);
```

The `<Labeled label>` uses the humanized source by default. You can customize it by passing a `label` prop to the fields:

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
            <Labeled label="My Custom Title">
                <TextField source="title" />
            </Labeled>
            <Labeled label="my.custom.translationKey">
                <TextField source="description" />
            </Labeled>
        </Stack>
    </Show>
);
```

You can disable the `<Labeled>` decoration by passing setting `label={false}` on a field:

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

## `spacing`

`<SimpleShowLayout>` renders a Material UI `<Stack>`. You can customize the spacing of each row by passing a `spacing` prop:

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

## `divider`

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

## `sx`: CSS API

The `<SimpleShowLayout>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                     | Description                                             |
|-------------------------------|---------------------------------------------------------|
| `& .RaSimpleShowLayout-stack` | Applied to the `<Stack>` element                        |
| `& .RaSimpleShowLayout-row`   | Applied to each child of the stack (i.e. to each field) |

To override the style of all instances of `<SimpleShowLayout>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaSimpleShowLayout` key.

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

## Rendering More Than One Column

`<SimpleShowLayout>` arranges fields with labels in a single column. If you need more than one column, you can use this component several times, for instance in a grid:

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

## Hiding The Field Labels

You can disable the `<Labeled>` decoration added by `<SimpleShowLayout>` by setting `label={false}` on a field:

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField label={false} source="title" />
        </SimpleShowLayout>
    </Show>
);
```

## See Also

* [Field components](./Fields.md)
* [Show Guesser](./ShowGuesser.md) guesses the fields based on the record type
* [TabbedShowLayout](./TabbedShowLayout.md) provides a more complex layout with tabs

## API

* [`<SimpleShowLayout>`]
* [`<Labeled>`]
* [`useRecordContext`]

[`<SimpleShowLayout>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/SimpleShowLayout.tsx
[`<Labeled>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/Labeled.tsx
[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/useRecordContext.ts
