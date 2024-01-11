---
layout: default
title: "The ReferenceOneInput Component"
---

# `<ReferenceOneInput>`

Use `<ReferenceOneInput>` in an `<Edit>` or `<Create>` view to edit a record linked to the current record via a one-to-one relationship, e.g. to edit the details of a book in the book edition view. It's an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component, part of the `@react-admin/ra-relationships` package. 

<video controls autoplay playsinline muted loop width="100%">
  <source src="./img/reference-one-input.webm" type="video/webm" />
  <source src="./img/reference-one-input.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<ReferenceOneInput>` renders the inputs provided as its children, and fetches the related record to populate them. When users change the related record fields, the `<ReferenceOneInput>` component stores these changes locally. Then, when users actually submit the form, `<ReferenceOneInput>` will update both the base record and the related record.

**Tip**: If you need to edit an *array* of related records, i.e. if there are several book details for a given book, you should use [`<ReferenceManyInput>`](./ReferenceManyInput.md) instead.

## Usage

Here is an example one-to-one relationship: a `book` has at most one `book_details` row associated to it.

```
┌─────────────┐       ┌──────────────┐
│ book        │       │ book_details │
│-------------│       │--------------│
│ id          │───┐   │ id           │
│ title       │   └──╼│ book_id      │
└─────────────┘       │ year         │
                      │ author       │
                      │ country      │
                      │ genre        │
                      │ pages        │
                      └──────────────┘
```

You probably want to let users edit the book details directly from the book Edition view (instead of having to go to the book details Edition view). `<ReferenceOneInput>` allows to do that.

```jsx
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
} from 'react-admin';
import { ReferenceOneInput } from '@react-admin/ra-relationships';

const BookEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="title" />
            <ReferenceOneInput reference="book_details" target="book_id">
                <NumberInput source="year" />
                <TextInput source="author" />
                <TextInput source="country" />
                <TextInput source="genre" />
                <NumberInput source="pages" />
            </ReferenceOneInput>
        </SimpleForm>
    </Edit>
);
```

`<ReferenceOneInput>` requires a `reference` and a `target` prop to know which entity to fetch, and one or more inputs as its `children` to edit the related record.

`<ReferenceOneInput>` persists the changes in the referenced record (book details in the above example) after persisting the changes in the main resource (book in the above example). This means that you can also use `<ReferenceOneInput>` in `<Create>` views.

**Tip**: `<ReferenceOneInput>` cannot be used with `undoable` mutations. You have to set `mutationMode="optimistic"` or `mutationMode="pessimistic"` in the parent `<Edit>`, as in the example above.

## Props

| Prop           | Required | Type                      | Default                          | Description                                                                                                                                                            |
| -------------- | -------- | ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`       | Required | `string`                  | -                                | Target field carrying the relationship on the referenced resource, e.g. 'book_id'                                                                                      |
| `reference`    | Required | `string`                  | -                                | The name of the resource for the referenced records, e.g. 'book_details'                                                                                               |
| `children`     | Required | `Element`                 | -                                | One or several input elements that accept a `source` prop                                                                                                              |
| `label`        | Optional | `string`                  | `reference`                      | Input label. In i18n apps, the label is passed to the `translate` function. Defaults to the humanized `reference` when omitted. Set `label={false}` to hide the label. |
| `source`       | Optional | `string`                  | `id`                             | Name of the field that carries the identity of the current record, used as origin for the relationship                                                                 |
| `filter`       | Optional | `Object`                  | -                                | Filters to use when fetching the related record, passed to `getManyReference()`                                                                                        |
| `sort`         | Optional | `{ field, order }`        | `{ field: 'id', order: 'ASC' }`  | Sort order to use when fetching the related record, passed to `getManyReference()`                                                                                     |
| `defaultValue` | Optional | `Object`                  | -                                | Default value for the related record (in case it does not yet exist)                                                                                                   |
| `sx`           | Optional | `SxProps`                 | -                                | Material UI shortcut for defining custom styles                                                                                                                                |

Additional props are passed to the Material UI `<Stack>` component.

## `children`

`<ReferenceOneInput>` expects input components as its children (like `<TextInput>`, `<NumberInput>`, etc.), which will allow to edit the related record. The inputs will be rendered inside a [Material UI `<Stack>`](https://mui.com/material-ui/react-stack/).

```jsx
<ReferenceOneInput reference="book_details" target="book_id">
    <NumberInput source="year" />
    <TextInput source="author" />
    <TextInput source="country" />
    <TextInput source="genre" />
    <NumberInput source="pages" />
</ReferenceOneInput>
```

**Important note**: `<ReferenceOneInput>` works by cloning its children and overriding their `source` prop, to add a temporary field name prefix. This means that, if you need to nest your inputs inside another component, you need to propagate the `source` prop to them.

## `defaultValue`

`<ReferenceOneInput>` allows to specify a default value for the related record. This is useful when the current record does not yet have a related record, and you want to pre-fill the related record with some default values.

{% raw %}

```jsx
<ReferenceOneInput
    reference="book_details"
    target="book_id"
    defaultValue={{ author: 'Gustave Flaubert', year: 1857 }}
>
    <NumberInput source="year" />
    <TextInput source="author" />
    <TextInput source="country" />
    <TextInput source="genre" />
    <NumberInput source="pages" />
</ReferenceOneInput>
```

{% endraw %}

## `filter`

`<ReferenceOneInput>` allows to specify filters to use when fetching the related record. This can be useful when you need additional filters to select the related record.

{% raw %}

```jsx
<ReferenceOneInput
    reference="book_details"
    target="book_id"
    filter={{ reviewed: true }}
>
    ...
</ReferenceOneInput>
```

{% endraw %}

## `label`

By default, `<ReferenceOneInput>` humanizes the `reference` name to build a label. You can customize the label by passing the `label` prop.

```jsx
<ReferenceOneInput
    reference="book_details"
    target="book_id"
    label="Detailed information about the book"
>
    ...
</ReferenceOneInput>
```

React-admin uses [the i18n system](https://marmelab.com/react-admin/Translation.html) to translate the label, so you can use translation keys to have one label for each language supported by the interface:

```jsx
<ReferenceOneInput
    reference="book_details"
    target="book_id"
    label="resource.books.fields.details"
>
    ...
</ReferenceOneInput>
```

## `reference`

The name of the resource to fetch for the related records.

For instance, if you want to display the `book_details` of a given `book`, the `reference` name should be `book_details`:

```jsx
<ReferenceOneInput reference="book_details" target="book_id">
    ...
</ReferenceOneInput>
```

## `sort`

`<ReferenceOneInput>` allows to specify the sort options used when fetching the related record. This can be useful when the relation table does not have an `id` column.

{% raw %}

```jsx
<ReferenceOneInput
    reference="book_details"
    target="book_id"
    sort={{ field: '_id', order: 'DESC' }}
>
    ...
</ReferenceOneInput>
```

{% endraw %}

## `source`

By default, `<ReferenceManyInput>` fetches the `reference` for which the `target` field equals the current record `id`. You can customize the field that carries the identity of the current record by setting the `source` prop.

```jsx
<ReferenceOneInput reference="book_details" target="book_id" source="_id">
    ...
</ReferenceOneInput>
```

## `sx`

You can override the style of the root component (a Material UI [`<FormControl>`](https://mui.com/material-ui/api/form-control/)) and its child components by setting the `sx` prop.

{% raw %}

```jsx
<ReferenceOneInput
  reference="book_details"
  target="book_id"
  sx={{ border: '1px solid red' }}
>
   ...
</ReferenceOneInput>
```

{% endraw %}

## `target`

Name of the field carrying the relationship on the referenced resource. For instance, if each `book` is linked to a record in `book_details`, and each `book_details` exposes a `book_id` field linking to the `book`, the `target` would be `book_id`.

```jsx
<ReferenceOneInput reference="book_details" target="book_id">
    ...
</ReferenceOneInput>
```

## Customizing The Child Inputs

`<ReferenceOneInput>` works by cloning its children and overriding their `source` prop, to add a temporary field name prefix. This means that, if you need to nest your inputs inside another component, you will need to propagate the `source` prop to them.

In this example, the `<TextInput>` component is wrapped inside a `<MyCustomInput>` component. That adds an icon and additional styling.

{% raw %}
```tsx
import AccountCircle from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClassIcon from '@mui/icons-material/Class';
import LanguageIcon from '@mui/icons-material/Language';
import { Box, SxProps } from '@mui/material';
import * as React from 'react';
import { TextInput } from 'react-admin';
import { ReferenceOneInput } from '@react-admin/ra-relationships';

const MyCustomInput = ({
    source,
    icon: Icon,
}: {
    source: string;
    icon: React.FunctionComponent<{ sx?: SxProps }>;
}) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Icon sx={{ color: 'action.active', mr: 1.5, my: 1 }} />
        <TextInput
            source={source} // Propagate the source prop to the real input
            variant="standard"
            size="small"
            helperText={false}
        />
    </Box>
);

export const CustomInputs = () => (
    <ReferenceOneInput reference="book_details" target="book_id">
        <MyCustomInput source="year" icon={CalendarMonthIcon} />
        <MyCustomInput source="author" icon={AccountCircle} />
        <MyCustomInput source="country" icon={LanguageIcon} />
        <MyCustomInput source="genre" icon={ClassIcon} />
        <MyCustomInput source="pages" icon={AutoStoriesIcon} />
    </ReferenceOneInput>
);
```
{% endraw %}

![ReferenceOneInput with custom inputs](https://marmelab.com/ra-enterprise/modules/assets/ra-relationships/latest/reference-one-input-custom-inputs.png)

## Limitations

-  `<ReferenceOneInput>` cannot be used inside an `<ArrayInput>` or a `<ReferenceManyInput>`.
-  `<ReferenceOneInput>` cannot have a `<ReferenceManyInput>` as one of its children.
