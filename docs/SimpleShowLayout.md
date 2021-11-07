---
layout: default
title: "SimpleShowLayout"
---

# `<SimpleShowLayout>`

The `<SimpleShowLayout>` pulls the `record` from the `RecordContext`. It renders a material-ui `<Card>` containing the record fields in a single-column layout (via material-ui's `<Stack>` component). `<SimpleShowLayout>` delegates the actual rendering of fields to its children. It wraps each field inside a `<Labeled>` component to add a label.

## Usage

Use `<SimpleShowLayout>` as descendent of a `<Show>` component (or any component creating a `<RecordContext>`), and st the fields to be displayed as children:

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

Here are all the props accepted by the `<SimpleShowLayout>` component:

* `className` is passed to the root component
* [`children`](#fields) are components rendering a record field
* [`component`](#root-component)
* [`divider`](#divider)
* [`spacing`](#spacing)

Additional props are passed to the root component (`<Card>`).

## Fields

`<SimpleShowLayout>` renders each child inside a `<Labeled>` component. The above snippet roughly translates to:

```jsx
const PostShow = () => (
    <Show>
        <Card>
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
        </Card>
    </Show>
);
```

The `<Labeled label>` uses the humanized source by default. You can customize it by passing a `label` prop to the fields:

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField label="My Custom Title" source="title" />
        </SimpleShowLayout>
    </Show>
);

// translates to
const PostShow = () => (
    <Show>
        <Card>
            <Stack>
                <Labeled label="My Custom Title">
                    <TextField source="title" />
                </Labeled>
            </Stack>
        </Card>
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
        <Card>
            <Stack>
                <TextField source="title" />
            </Stack>
        </Card>
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

## Root Component

By default, `<SimpleShowLayout>` view renders the main content area inside a material-ui `<Card>`. You can override the main area container by passing a `component` prop:

```jsx
// use a div as root component
const PostShow = () => (
    <Show>
        <SimpleShowLayout component="div">
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);
```

## CSS API

The `<SimpleShowLayout>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name   | Description                                              |
| ----------- | ---------------------------------------------------------|
| `stack`     | Applied to the `<Stack>` element                         |
| `row`       | Applied to each child of the stack (i.e. to each field)  |

To override the style of all instances of `<SimpleShowLayout>` using the [material-ui style overrides](https://mui.com/customization/theme-components/), use the `RaSimpleShowLayout` key.

## See Also

* [Field components](./Fields.md)
* [Show Guesser](./ShowGuesser.md) guesses the fields based on the record type
* [TabbedShowLayout](./TabbedShowLayout.md) provides a more complex layout with tabs

## API

* [`<SimpleShowLayout>`]
* [`<Labeled>`]
* [`useRecordContext`]

[`<SimpleShowLayout>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/SimpleShowLayout.tsx
[`<Labeled>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/input/Labeled.tsx
[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/RecordContext.tsx
