---
layout: default
title: "TabbedShowLayout"
---

# `<TabbedShowLayout>`

The `<TabbedShowLayout>` pulls the `record` from the `RecordContext`. It renders a set of `<Tabs>`, each of which contains a list of record fields in a single-column layout (via Material UI's `<Stack>` component). `<TabbedShowLayout>` delegates the actual rendering of fields to its children, which should be `<TabbedShowLayout.Tab>` elements. `<TabbedShowLayout.Tab>`  wraps each field inside a `<Labeled>` component to add a label.

Switching tabs will update the current url. By default, it uses the tabs indexes and the first tab will be displayed at the root url. You can customize the path by providing a `path` prop to each `<TabbedShowLayout.Tab>` component. If you'd like the first one to act as an index page, just omit the `path` prop.

<video controls autoplay playsinline muted loop>
  <source src="./img/tabbed-show.webm" type="video/webm"/>
  <source src="./img/tabbed-show.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage 

Use `<TabbedShowLayout>` as descendant of a `<Show>` component (or any component creating a `<RecordContext>`), define the tabs via `<TabbedShowLayout.Tab>` children, and set the fields to be displayed as children of each tab:

{% raw %}
```jsx
import { Show, TabbedShowLayout } from 'react-admin'

export const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="summary">
                <TextField label="Id" source="id" />
                <TextField source="title" />
                <TextField source="teaser" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="body" path="body">
                <RichTextField source="body" label={false} />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Miscellaneous" path="miscellaneous">
                <TextField label="Password (if protected post)" source="password" type="password" />
                <DateField label="Publication date" source="published_at" />
                <NumberField source="average_note" />
                <BooleanField label="Allow comments?" source="commentable" defaultValue />
                <TextField label="Nb views" source="views" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="comments" path="comments">
                <ReferenceManyField reference="comments" target="post_id" label={false}>
                    <Datagrid>
                        <TextField source="body" />
                        <DateField source="created_at" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```
{% endraw %}

## Props

* [`children`](#tabs): components rendering a tab
* `className`: passed to the root component
* [`divider`](#divider): optional element to render between each field
* [`record`](#controlled-mode): can be injected when outside a RecordContext 
* [`spacing`](#spacing): optional integer to set the spacing between the fields
* [`sx`](#sx-css-api): Override the styles
* [`syncWithLocation`](#sync-tabs-with-location): optional boolean to disable storing the active tab in the url
* [`tabs`](#custom-tab-component): custom Tabs component

Additional props are passed to the root component (`<div>`).

## Tabs

Children of `<TabbedShowLayout>` must be `<TabbedShowLayout.Tab>` components.

The `<TabbedShowLayout.Tab>` component renders tabs headers and the active tab. It manages the tab change, either via the URL, or an internal state.

It accepts the following props:

- `label`: The string displayed for each tab
- `icon`: The icon to show before the label (optional). Must be a component.
- `path`: The string used for custom urls (optional)
- `count`: the number of items in the tab (dislayed close to the label)

```jsx
// in src/posts.js
import * as React from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { Show, TabbedShowLayout, TextField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Content" icon={<FavoriteIcon />}>
                <TextField source="title" />
                <TextField source="subtitle" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Metadata" icon={<PersonIcon />} path="metadata">
                <TextField source="category" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

## Tab Fields

`<TabbedShowLayout.Tab>` renders each child inside a `<Labeled>` component. This component uses the humanized source as label by default. You can customize it by passing a `label` prop to the fields:

```jsx
const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="main">
                <TextField label="My Custom Title" source="title" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```


The `<Labeled label>` uses the humanized source by default. You can customize it by passing a `label` prop to the fields:

```jsx
const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="main">
                <TextField label="My Custom Title" source="title" />
                <TextField label="my.custom.translationKey" source="description" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);

// translates to
const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <Labeled label="My Custom Title">
                <TextField source="title" />
            </Labeled>
            <Labeled label="my.custom.translationKey">
                <TextField source="description" />
            </Labeled>
        </TabbedShowLayout>
    </Show>
);
```

You can disable the `<Labeled>` decoration by passing setting `label={false}` on a field:

```jsx
const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="main">
                <TextField label={false} source="title" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

`<TabbedShowLayout.Tab>` children can be anything you want. Try passing your own components:

```jsx
const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post "{record.title}"</span>;
};

const PostShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="main">
                <PostTitle label="title" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

## Sync Tabs With Location

To let users come back to a previous tab by using the browser's back button, `<TabbedShowLayout>` stores the active tab in the location by default. You can opt out the location synchronization by passing `false` to the `syncWithLocation` prop. This allows e.g. to have several `<TabbedShowLayout>` components in a page.

{% raw %}
```jsx
import { TabbedShowLayout, Tab } from 'react-admin'

export const PostShow = () => (
    <Show>
        <TabbedShowLayout syncWithLocation={false}>
            <TabbedShowLayout.Tab label="summary">
                <TextField label="Id" source="id" />
                <TextField source="title" />
                <TextField source="teaser" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="body" path="body">
                <RichTextField source="body" label={false} />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Miscellaneous" path="miscellaneous">
                <TextField label="Password (if protected post)" source="password" type="password" />
                <DateField label="Publication date" source="published_at" />
                <NumberField source="average_note" />
                <BooleanField label="Allow comments?" source="commentable" defaultValue />
                <TextField label="Nb views" source="views" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="comments" path="comments">
                <ReferenceManyField reference="comments" target="post_id" label={false}>
                    <Datagrid>
                        <TextField source="body" />
                        <DateField source="created_at" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```
{% endraw %}

**Tip**: When `syncWithLocation` is `false`, the `path` prop of the `<TabbedShowLayout.Tab>` components is ignored.

## Spacing

`<TabbedShowLayout.Tab>` renders a Material UI `<Stack>`. You can customize the spacing of each row by passing a `spacing` prop:

```jsx
const PostShow = () => (
    <Show>
        <TabbedShowLayout spacing={2}>
            <TabbedShowLayout.Tab label="main">
                <PostTitle label="title" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

The default spacing is `1`.

## Divider

`<Stack>` accepts an optional `divider` prop - a component rendered between each row. `<TabbedShowLayout>` also accepts this props, and passes it to the `<Stack>` component.

```jsx
import { Divider } from '@mui/material';

const PostShow = () => (
    <Show>
        <TabbedShowLayout divider={<Divider flexItem />}>
            <TabbedShowLayout.Tab label="main">
                <PostTitle label="title" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

## Custom Tab Component

By default, `<TabbedShowLayout>` renders its tabs using `<TabbedShowLayoutTabs>`, an internal react-admin component. You can pass a custom component as the `tabs` prop to override that default. Also, props passed to `<TabbedShowLayoutTabs>` are passed to the Material UI's `<Tabs>` component inside `<TabbedShowLayoutTabs>`. That means you can create a custom `tabs` component without copying several components from the react-admin source.

For instance, to make use of scrollable `<Tabs>`, you can pass `variant="scrollable"` and `scrollButtons="auto"` props to `<TabbedShowLayoutTabs>` and use it in the `tabs` prop from `<TabbedShowLayout>` as follows:

```jsx
import {
    Show,
    TabbedShowLayout,
    TabbedShowLayoutTabs,
} from 'react-admin';

const ScrollableTabbedShowLayout = props => (
    <Show {...props}>
        <TabbedShowLayout tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" {...props} />}>
            ...
        </TabbedShowLayout>
    </Show>
);

export default ScrollableTabbedShowLayout;
```

## Controlled Mode

By default, `<TabbedShowLayout>` reads the record from the `RecordContext`. But by passing a `record` prop, you can render the component outside a `RecordContext`.

{% raw %}
```jsx
const StaticPostShow = () => (
    <TabbedShowLayout record={{ id: 123, title: 'Hello world' }}>
        <TabbedShowLayout.Tab label="main">
            <TextField source="title" />
        </TabbedShowLayout.Tab>
    </TabbedShowLayout>
);
```
{% endraw %}

When passed a `record`, `<TabbedShowLayout>` creates a `RecordContext` with the given record.

## `sx`: CSS API

The `<TabbedShowLayout>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                       | Description                                              |
|---------------------------------| ---------------------------------------------------------|
| `& .RaTabbedShowLayout-content` | Applied to the content zone (under the tabs)             |

To override the style of all instances of `<TabbedShowLayout>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaTabbedShowLayout` key.

To style the tabs, the `<TabbedShowLayout.Tab>` component accepts two props:

- `className` is passed to the tab *header*
- `contentClassName` is passed to the tab *content*

## See Also

* [Field components](./Fields.md)
* [Show Guesser](./ShowGuesser.md) guesses the fields based on the record type
* [SimpleShowLayout](./TabbedShowLayout.md) provides a simpler layout with no tabs

## API

* [`<TabbedShowLayout>`]
* [`<TabbedShowLayout.Tab>`]
* [`<Labeled>`]
* [`useRecordContext`]

[`<Labeled>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/Labeled.tsx
[`<TabbedShowLayout>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/TabbedShowLayout.tsx
[`<TabbedShowLayout.Tab>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/Tab.tsx
[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/useRecordContext.ts
