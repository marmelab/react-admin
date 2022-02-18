---
layout: default
title: "The ReferenceArrayField Component"
---

# `<ReferenceArrayField>`

Use `<ReferenceArrayField>` to display a one-to-many relationship based on an array of foreign keys. This component fetches a list of referenced records (using the `dataProvider.getMany()` method), and passes them to its child. A `<ReferenceArrayField>` displays nothing on its own, it just fetches the data and expects its child to render it.

For instance, if each post contains a list of tag ids (e.g. `{ id: 1234, title: 'Lorem Ipsum', tag_ids: [1, 23, 4] }`), here is how to fetch the list of tags for each post in a list, and display the `name` for each `tag` in a `<ChipField>`:

```jsx
import * as React from "react";
import { List, Datagrid, ChipField, ReferenceArrayField, SingleFieldList, TextField } from 'react-admin';

export const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
            <EditButton />
        </Datagrid>
    </List>
);
```

![ReferenceArrayField](./img/reference-array-field.png)

`<ReferenceArrayField>` fetches the `tag` resources related to each `post` resource by matching `post.tag_ids` to `tag.id`. Once it receives the related resources, `<ReferenceArrayField>` passes them to its child component using the `ids` and `data` props, so the child must be an iterator component (like `<SingleFieldList>` or `<Datagrid>`). The iterator component usually has one or more child `<Field>` components.

## Properties

| Prop         | Required | Type                | Default                          | Description                                                                                                                                |
| ------------ | -------- | ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `reference`  | Required | `string`            | -                                | The name of the resource for the referenced records, e.g. 'tags'                                                                           |
| `children`   | Required | `Element`           | -                                | The Field element used to render the referenced records                                                                                    |
| `sortBy`     | Optional | `string | Function` | `source`                         | When used in a `List`, name of the field to use for sorting when the user clicks on the column header. |
| `filter`     | Optional | `Object`            | -                                | Filters to use when fetching the related records (the filtering is done client-side)                                                       |
| `pagination` | Optional | `Element`           | -                                | Pagination element to display pagination controls. empty by default (no pagination)                                                        |
| `perPage`    | Optional | `number`            | 1000                             | Maximum number of results to display                                                                                                       |
| `sort`       | Optional | `{ field, order }`  | `{ field: 'id', order: 'DESC' }` | Sort order to use when displaying the related records (the sort is done client-side)                                                       |

`<ReferenceArrayField>` also accepts the [common field props](./Fields.md#common-field-props), except `emptyText` (use the child `empty` prop instead).

## `sx`: CSS API

The `<ReferenceArrayField>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI  components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                           | Description                                                                              |
|-------------------------------------|------------------------------------------------------------------------------------------|
| `& .RaReferenceArrayField-progress` | Applied to the MUI 's `LinearProgress` component while `isLoading` prop is `true` |

To override the style of all instances of `<ReferenceArrayField>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaReferenceArrayField` key.

## Usage

`<ReferenceArrayField>` expects a `reference` attribute, which specifies the resource to fetch for the related records. It also expects a `source` attribute, which defines the field containing the list of ids to look for in the referenced resource.

**Note**: You **must** add a `<Resource>` component for the reference resource to your `<Admin>` component, because react-admin needs it to fetch the reference data. You can omit the `list` prop in this Resource if you don't want to show an entry for it in the sidebar menu.

```jsx
export const App = () => (
    <Admin dataProvider={restProvider('http://path.to.my.api')}>
        <Resource name="posts" list={PostList} />
        <Resource name="tags" /> {/* <= this one is compulsory */}
    </Admin>
);
```

In an Edit of Show view, you can combine `<ReferenceArrayField>` with `<Datagrid>` to display related resources in a table. For instance, to display more details about the tags related to a post in the `PostShow` view:

```jsx
import * as React from "react";
import { Show, SimpleShowLayout, TextField, ReferenceArrayField, Datagrid, ShowButton } from 'react-admin';

export const PostShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    <ShowButton />
                </Datagrid>
            </ReferenceArrayField>
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```
