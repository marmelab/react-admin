---
layout: default
title: "The RecordField Component"
---

# `<RecordField>`

`<RecordField>` displays a label and a record property.

![RecordField](./img/RecordField.png)

## Usage

Use `<RecordField>` as descendent of a [`RecordContextProvider`](./useRecordContext.md#creating-a-record-context) like in record detail components (`<Show>`, `<Edit>`, `<ReferenceField>`, `<ReferenceOneField>`).

For instance, to render the title of a book in a show view:

```jsx
import { Show, RecordField } from 'react-admin';
import { Stack } from '@mui/material';

export const BookShow = () => (
    <Show>
        <Stack>
            <RecordField source="title" />
        </Stack>
    </Show>
);
```

`<RecordField>` renders a label based on the humanized `source` prop, or on the `label` prop if present. It also grabs the `record` from the current [`RecordContext`](./useRecordContext.md), extracts the `record[source]` property, and displays it using a [`<TextField>`](./TextField.md) by default.

You can override the label by passing a `label` prop:

```jsx
<RecordField source="title" label="Book title" />
```

The `source` prop can be a [deep source](./Fields.md#deep-field-source):

```jsx
<RecordField label="Author name" source="author.name" />
```

You can customize the way the value is displayed by passing a Field component in the `field` prop. For example, to display a numeric value using the browser locale, use the `NumberField`:

```jsx
import { RecordField, NumberField } from 'react-admin';

<RecordField source="price" field={NumberField} />
```

If you need to pass specific props to the field component, for example to format the value, prefer passing a field component as child. In this case, the `source` passed to the `RecordField` will only be used for the label:

{% raw %}
```jsx
import { RecordField, NumberField } from 'react-admin';

<RecordField source="price">
    <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
</RecordField>
```
{% endraw %}

If you need to aggregate multiple fields, you can use the `render` prop instead, to pass a function that receives the current record and returns a React element:

```jsx
import { RecordField } from 'react-admin';

<RecordField
    label="Name"
    render={record => `${record.firstName} ${record.lastName}`}
/>
```

The `source`, `field`, `children`, and  `render` props are mutually exclusive.

## Props

| Prop        | Required | Type                    | Default | Description                                                                      |
| ----------- | -------- | ----------------------- | ------- | -------------------------------------------------------------------------------- |
| `children`  | Optional | ReactNode               | ''      | Elements rendering the actual field. |
| `className` | Optional | string                  | ''      | CSS class name to apply to the field.                                            |
| `empty`     | Optional | ReactNode               | ''     | Text to display when the field is empty.                                         |
| `field`     | Optional | ReactElement            | `TextField` | Field component used to render the field. Ignored if `children` or `render` are set. |
| `label`     | Optional | string                  | ''      | Label to render. Can be a translation key. |
| `render`    | Optional | record => JSX           |         | Function to render the field value. Ignored if `children` is set.  |
| `source`    | Optional | string                  | ''      | Name of the record field to render. |
| `sx`        | Optional | object                  | {}      | Styles to apply to the field.                                                  |
| `TypographyProps` | Optional | object            | {}      | Props to pass to label wrapper |
| `variant`   | Optional | `'default' || 'inline'` | 'default' | When `inline`, the label is displayed inline with the field value.                                                  |

## `children`

The `children` prop is used to pass a field component that will be rendered instead of the default one. The `source` prop will only be used for the label.

{% raw %}
```jsx
import { RecordField, NumberField } from 'react-admin';

<RecordField source="price">
    <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
</RecordField>
```
{% endraw %}

This ability is often used to render a field from a reference record, using [`<ReferenceField>`](./ReferenceField.md):

```jsx
import { RecordField, ReferenceField } from 'react-admin';

<RecordField label="Author">
    <ReferenceField source="author_id" reference="users" />
</RecordField>
```

If you just need to use a field component without any special prop, prefer the `field` prop:

```jsx
import { RecordField, NumberField } from 'react-admin';

<RecordField source="price" field={NumberField} />
// instead of
<RecordField source="price">
    <NumberField source="price" />
</RecordField>
```

## `empty`

When the record contains no value for the `source` prop, `RecordField` renders an empty string. If you need to render a custom string in this case, you can use the `empty` prop :

```jsx
<RecordField source="title" empty="Missing title" />
```

`empty` also accepts a translation key, so you can have a localized string when the field is empty:

```jsx
<RecordField source="title" empty="resources.books.fields.title.missing" />
```

If you use the `render` prop, you can even use a React element as `empty` value.

{% raw %}
```jsx
<RecordField
    source="title"
    empty={<span style={{ color: 'red' }}>Missing title</span>}
    render={record => record.title}
/>
```
{% endraw %}

Note that `empty` is ignored when you pass a custom field component as child. In this case, it's the child's responsibility to handle the empty value.

```jsx
<RecordField label="title">
    <TextField source="title" emptyText="Missing title" />
</RecordField>
```

## `field`

By default, `<RecordField>` uses the [`<TextField>`](./TextField.md) component to render the field value. 

```jsx
<RecordField source="title" />
// equivalent to
<RecordField source="title" field={TextField} />
```

Use the `field` prop to pass a custom field component instead:

```jsx
import { RecordField, NumberField } from 'react-admin';

<RecordField source="price" field={NumberField} />
```

If you need to pass specific props to the field component, for example to format the value, prefer passing a field component as child. In this case, the `source` passed to the `RecordField` will only be used for the label:

{% raw %}
```jsx
import { RecordField, NumberField } from 'react-admin';

<RecordField source="price">
    <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
</RecordField>
```
{% endraw %}

## `label`

When you use the `source` prop, the label is automatically generated from the source name using the "humanize" function. For example, the source `author.name` will be displayed as "Author name".

You can customize the label by passing a custom [translation](./Translation.md) for the `resources.${resourceName}.fields.${source}` key. For example, if you have a resource called `posts`, and you want to customize the label for `<RecordField source="title" />` field, you can add the following translation:

```json
{
    "resources": {
        "posts": {
            "fields": {
                "title": "Post title"
            }
        }
    }
}
```

If you don't use the `source` prop, or if you don't want to use the i18N features to customize the label, you can use the `label` prop to override the default label:

```jsx
<RecordField source="title" label="Post title" />
```

If you pass a translation key as `label`, react-admin will use the `i18nProvider` to translate it:

```jsx
<RecordField source="title" label="resources.posts.fields.title_custom" />
```

Finally, you can pass `false` to the `label` prop to hide the label:

```jsx
<RecordField source="title" label={false} />
```

Note that using `label={false}` is equivalent to rendering a `<TextField>` directly. 

## `render`

The `render` prop is used to pass a function that receives the current record and returns a React element. This is useful when you need to aggregate multiple fields, or when you need to use a component that doesn't accept the `source` prop.

```jsx
import { RecordField } from 'react-admin';

<RecordField
    label="Name"
    render={record => `${record.firstName} ${record.lastName}`}
/>
```

If you pass both `source` and `render`, the `source` will be used for the label only.

## `sx`

Use the `sx` prop to pass custom styles to the field.

{% raw %}
```jsx
<RecordField source="id" sx={{ opacity: 0.5 }} />
```
{% endraw %}

If you want to style the label, use the `TypographyProps` prop instead:

{% raw %}
```jsx
<RecordField
    source="id"
    TypographyProps={{ sx: { color: 'red' } }}
/>
```
{% endraw %}

If you want to style the value only, prefer passing a custom component as child:

{% raw %}
```jsx
<RecordField source="id">
    <TextField source="id" sx={{ color: 'red' }} />
</RecordField>
```
{% endraw %}

## `source`

Use the `source` prop to specify the name of the record field to render. 

For example, if the current record is:

```json
{
    "id": 123,
    "title": "My post",
    "author": {
        "name": "John Doe"
    }
}
```

To display the `title` field, use:

```jsx
<RecordField source="title" />
```

The `source` prop can be a deep source, for example `author.name`.

```jsx
<RecordField source="author.name" />
```

If you use the `render` or `children` prop, the `source` will only be used for the label. 

## `TypographyProps`

The `TypographyProps` prop is used to pass props to the label wrapper. This is useful when you want to style the label differently from the field value.

{% raw %}
```jsx
<RecordField
    source="id"
    TypographyProps={{ sx: { color: 'red' } }}
/>
```
{% endraw %}

## `variant`

By default, `<RecordField>` renders the label above the field value. You can use the `variant` prop to render the label inline with the field value:

```jsx
<RecordField
    source="title"
    variant="inline"
/>
```

If you need to customize the width of the label, you can use the `TypographyProps` prop:

{% raw %}
```jsx
<RecordField
    source="title"
    variant="inline"
    TypographyProps={{ sx: { width: 200 } }}
/>
```
{% endraw %}

But since you generally need to do it for several fields, it's preferable to do it in the parent component:

{% raw %}
```jsx
<Stack sx={{ '& .RaRecordField-label': { width: 200 } }}>
    <RecordField variant="inline" source="id" />
    <RecordField variant="inline" source="title" />
    <RecordField variant="inline" source="author" />
    <RecordField variant="inline" source="summary" />
    <RecordField variant="inline" source="year" field={NumberField} />
</Stack>
```
{% endraw %}

**Tip**: If you want all your fields to be displayed inline, you can define the default variant for `RecordField` [in a custom application Theme](https://marmelab.com/react-admin/AppTheme.html#theming-individual-components):

```jsx
import { defaultTheme } from 'react-admin';
import { deepmerge } from '@mui/utils';

const theme = deepmerge(defaultTheme, {
    components: {
        RaRecordField: {
            defaultProps: {
                variant: 'inline',
            },
        },
    },
});

const App = () => (
    <Admin theme={theme}>
        // ...
    </Admin>
);
```

## TypeScript

`<RecordField>` is a generic component. You can pass a type parameter to get hints for the `source` prop and type safety for the `record` argument of the `render` function.

```tsx
import { Show, RecordField } from 'react-admin';
import { Stack } from '@mui/material';

import { Book } from './types';

const BookShow = () => {
    const BookField = RecordField<Book>;
    return (
        <Show>
            <Stack>
                <BookField source="title" />
                <BookField source="author.name" />
                <BookField source="price" render={record => `${record.price} USD`} />
            </Stack>
        </Show>
    );
};
```
