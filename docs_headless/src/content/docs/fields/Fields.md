---
title: "Introduction"
---

A `Field` component displays a given property of a record. Such components are used in the `List` and `Show` views, but you can also use them anywhere in your application, as long as there is a [`RecordContext`](../common/useRecordContext.md).

## Anatomy Of A Field

`Field` components read the current `record` from the current `RecordContext` (set by react-admin). There is nothing magic there - you can easily write your own:

```jsx
import { useRecordContext } from 'ra-core';

const PurpleTextField = ({ source }) => {
    const record = useRecordContext();
    return (<span style={{ color: 'purple' }}>{record && record[source]}</span>);
};
```

**Tip**: Every time it renders a record, react-admin creates a `RecordContext`. This includes `<DataTable>` rows, simple list items, reference fields, show, and edit pages. You can even create a `RecordContext` yourself and use react-admin Fields in custom pages.

React-admin Field components also accept a `record` prop. This allows you to use them outside a `RecordContext`, or to use another `record` than the one in the current context.

```jsx
// a post looks like
// { id: 123, title: "Hello, world", author: "John Doe", body: "..." }

const PostShow = ({ id }) => {
    const { data, isPending } = useGetOne('books', { id });
    if (isPending) return <span>Loading</span>; 
    return (
        <dl>
            <dt>Title</dt>
            <dd><TextField record={data} source="title" /></dd>
            <dt>Author</dt>
            <dd><PurpleTextField record={data} source="author" /></dd>
        </dl>   
    );
}
```

## Deep Field Source

If your field is leveraging [`useFieldValue`](./useFieldValue.md) it will use the `source` as a *path* to read the actual value (using [`lodash.get()`](https://lodash.com/docs/4.17.15#get)). This means you can include dots in the source name to render a deeply nested value. 

For instance, if you have a record like the following:

```js
{ 
    id: 123,
    title: "War And Peace",
    author: {
        name: "Leo Tolstoy",
    }
}
```

Then you can render the author name like this:

```jsx
<TextField source="author.name" />
```

This is particularly handy if your data provider supports [Relationship Embedding](../data-fetching/DataProviders.md#embedding-relationships).

```jsx
const { data } = useGetOne('posts', { id: 123, meta: { embed: ['author'] } });
```

## Setting A Field Label

Fields are usually not responsible of rendering their labels, this is the responsibility of the parent layout component (show layout, datagrid, ...).

However you may find it convenient to still be able to configure the `label` prop on the Field component itself.

In any case, it's a good idea to have your component support [translation keys](../guides/Translation.md#translation-keys) in `label`, and hiding labels when `label={false}`.

When `label` is omitted, you can use the humanized `source` property as default label.

**Tip**: Use the `<FieldTitle>` component to help you implement this logic.

## Writing Your Own Field Component

If you don't find what you need in the list of available Fields, you can write your own Field component.

<iframe src="https://www.youtube-nocookie.com/embed/tTNDAssRJhU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

A custom field must be a regular React component retrieving the `record` from the `RecordContext` with the `useRecordContext` hook. React-admin will set the `record` in this context based on the API response data at render time. If you pass a `source`, the field component needs to find the corresponding value in the `record` and render it.

Let's see an example for an API returning user records with `firstName` and `lastName` properties.

```js
{
    id: 123,
    firstName: 'John',
    lastName: 'Doe'
}
```

Here is a custom field displaying the full name:

```jsx
import { useRecordContext } from 'react-admin';

export const FullNameField = (props) => {
    const record = useRecordContext(props);
    return record ? <span>{record.firstName} {record.lastName}</span> : null;
}
```

**Tip**: Always check the `record` is defined before inspecting its properties, as react-admin may display the Show view *before* fetching the record from the data provider. So the first time it renders the show view for a resource, the `record` is `undefined`.

You can now use this field like any other react-admin field:

```jsx
import { ShowBase } from 'ra-core';
import { FullNameField } from './FullNameField';

export const UserList = () => (
    <ShowBase>
        <div>
            <FullNameField source="lastName" />
        </div>
    </ShowBase>
);
```

If you build a reusable field accepting a `source` props, you will probably want to support deep field sources (e.g. source values like `author.name`). Use the [`useFieldValue` hook](./useFieldValue.md) to replace the simple object lookup. For instance, for a Text field:

```diff
import * as React from 'react';
-import { useRecordContext } from 'ra-core';
+import { useFieldValue } from 'ra-core';

const TextField = (props) => {
-    const record = useRecordContext();
+   const value = useFieldValue(props);
-   return record ? <span>{record[props.source]}</span> : null;
+   return value ? <span>{value}</span> : null;
}

export default TextField;
```

**Tip**: Note that when using `useFieldValue`, you don't need to check that `record` is defined.

## Hiding A Field Based On The Value Of Another

In a Show view, you may want to display or hide fields based on the value of another field - for instance, show an `email` field only if the `hasEmail` boolean field is `true`.

For such cases, you can use [the `<WithRecord>` component](../common/WithRecord.md), or the custom field approach: write a custom field that reads the `record` from the context, and renders another Field based on the value.

```jsx
import { ShowBase, useRecordContext } from 'ra-core';
import { TextField } from './TextField';

const EmailField = ({ source }) => {
    const record = useRecordContext();
    return record ? <span>{record[source]}</span> : null;
};

const ConditionalEmailField = () => {
    const record = useRecordContext();
    return record && record.hasEmail ? <EmailField source="email" /> : null;
}

const UserShow = () => (
    <ShowBase>
        <div>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ConditionalEmailField />
        </div>
    </ShowBase>
);
```

## Linking To Other Records

A custom Field component might need to display a link to another record. Build the URL to the distant record using the resource name and the id, as follows:

```js
import { useRecordContext, useGetOne } from 'ra-core';
import { Link } from 'react-router-dom';

const AuthorField = () => {
    const post = useRecordContext();
    const { data, isPending } = useGetOne('users', { id: post.user_id });
    const userShowPage = `/users/${post.user_id}/show`;

    return isPending ? null : <Link to={userShowPage}>{data.username}</Link>;
};
```
