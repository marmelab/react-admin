---
layout: default
title: "Field Components"
---

# Field Components

A `Field` component displays a given property of a REST resource. Such components are used in the `List` view, but you can also use them in the `Edit` and `Create` views for read-only fields. The most usual of all field components is `<TextField>`:

```js
// in src/posts.js
import React from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest/lib/mui';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```

All field components accept the following attributes:

* `source`: Property name of your entity to view/edit. This attribute is required.
* `label`: Used as a table header of an input label. Defaults to the `source` when omitted.

```js
<TextField source="zb_title" label="Title" />
```

If you display a record with a complex structure, you can use a path with dot separators as the `source` attribute. For instance, if the API returns the following 'book' record:

```js
{
    id: 1234,
    title: 'War and Peace',
    author: {
        firstName: 'Leo',
        lastName: 'Tolstoi'
    }
}
```

Then you can display the author first name as follows:

```js
<TextField source="author.firstName" />
```

## `<ChipField>`

Displays a value inside a ["Chip"](http://www.material-ui.com/#/components/chip), which is Material UI's term for a label.

``` js
import { ChipField } from 'admin-on-rest/mui';

<ChipField source="category" />
```

![ChipField](./img/chip-field.png)

This field type is especially useful for one to many relationships, e.g. to display a list of books for a given author:

``` js
import { ChipField, SingleFieldList, ReferenceManyField } from 'admin-on-rest/mui';

<ReferenceManyField reference="books" target="author_id">
    <SingleFieldList>
        <ChipField source="title" />
    </SingleFieldList>
</ReferenceManyField>
```

## `<DateField>`

Displays a date or datetime.

``` js
import { DateField } from 'admin-on-rest/mui';

<DateField source="publication_date" />
```

This component accepts a `showTime` attribute (false by default) to force the display of time in addition to date (using `Date.toLocaleString()`):

```js
<DateField source="publication_date" showTime={true} />
```

## `<EmailField>`

`<EmailField>` displays an email as a `<a href="mailto:" />` link.

``` js
import { EmailField } from 'admin-on-rest/mui';

<EmailField source="personal_email" />
```

## `<ReferenceField>`

This component fetches a single referenced record (using the `GET_MANY` REST method), and displays one field of this record. That's why a `<ReferenceField>` must always have a child `<Field>`.

For instance, here is how to fetch the `post` related to `comment` records, and display the `title` for each:

```js
import React from 'react';
import { List, Datagrid, ReferenceField, TextField } from 'admin-on-rest/mui';

export const CommentList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField label="Post" source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
        </Datagrid>
    </List>
);
```

With this configuration, `<ReferenceField>` wraps the comment title in a link to the related post `<Edit>` view.

![ReferenceField](./img/reference-field.png)

`<ReferenceField>` accepts a `reference` attribute, which specifies the resource to fetch for the related record. Also, you can use any `Field` component as child.

**Tip**: Admin-on-rest accumulates and deduplicates the ids of the referenced records to make *one* `GET_MANY` call for the entire list, instead of n `GET_ONE` calls. So for instance, if the API returns the following list of comments:

```js
[
    {
        id: 123,
        body: 'Totally agree',
        post_id: 789,
    },
    {
        id: 124,
        title: 'You are right my friend',
        post_id: 789
    },
    {
        id: 125,
        title: 'Not sure about this one',
        post_id: 735
    }
]
```

Then admin-on-rest renders the `<CommentList>` with a loader for the `<ReferenceField>`, fetches the API for the related posts in one call (`GET http://path.to.my.api/posts?ids=[789,735]`), and re-renders the list once the data arrives. This accelerates the rendering, and minimizes network load.

## `<ReferenceManyField>`

This component fetches a list of referenced record (using the `GET_MANY_REFERENCE` REST method), and passes the result to an iterator component (like `<SingleFieldList>` or `<Datagrid>`). The iterator component usually has one or more child `<Field>` components.

For instance, here is how to fetch the `comments` related to a `post` record, and display the `author.name` for each, in a `<ChipField>`:

```js
import React from 'react';
import { List, Datagrid, ChipField, ReferenceManyField, SingleFieldList, TextField } from 'admin-on-rest/mui';

export const PostList = (props) => (
    <List {...props} filter={PostFilter}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" type="email" />
            <ReferenceManyField label="Comments by" reference="comments" target="post_id">
                <SingleFieldList>
                    <ChipField source="author.name" />
                </SingleFieldList>
            </ReferenceManyField>
            <EditButton />
        </Datagrid>
    </List>
);
```

![ReferenceManyFieldSingleFieldList](./img/reference-many-field-single-field-list.png)

You can use a `<Datagrid>` instead of a `<SingleFieldList>` - but not inside another `<Datagrid>`! This is useful if you want to display a read-only list of related records. For instance, if you want to show the `comments` related to a `post` in the post's `<Edit>` view:

```js
import React from 'react';
import { Edit, Datagrid, DisabledInput, DateField, EditButton, ReferenceManyField, TextField, TextInput } from 'admin-on-rest/mui';

export const PostEdit = (props) => (
    <Edit {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput source="title" />
        <ReferenceManyField label="Comments" reference="comments" target="post_id">
            <Datagrid>
                <TextField source="body" />
                <DateField source="created_at" />
                <EditButton />
            </Datagrid>
        </ReferenceManyField>
    </Edit>
);
```

![ReferenceManyFieldDatagrid](./img/reference-many-field-datagrid.png)

## `<RichTextField>`

This component displays some HTML content. The content is "rich" (i.e. unescaped) by default.

``` js
import { RichTextField } from 'admin-on-rest/mui';

<RichTextField source="body" />
```

![RichTextField](./img/rich-text-field.png)

The `stripTags` attribute (`false` by default) allows you to remove any HTML markup, preventing some display glitches (which is especially useful in list views).

``` js
import { RichTextField } from 'admin-on-rest/mui';

<RichTextField source="body" stripTags />
```

## `<TextField>`

The most simple as all fields, `<TextField>` simply displays the record property as plain text.

``` js
import { TextField } from 'admin-on-rest/mui';

<TextField label="Author Name" source="name" />
```

## `<UrlField>`

`<UrlField>` displays an url in an `< a href="">` tag.

``` js
import { UrlField } from 'admin-on-rest/mui';

<UrlField source="site_url" />
```

## Writing Your Own Field Component

If you don't find what you need in the list above, it's very easy to write your own Field component. It must be a regular React component, accepting not only a `source` attribute, but also a `record` attribute. Admin-on-rest will inject the `record` based on the API response data at render time. The field component only needs to find the `source` in the `record` and display it.

For instance, here is an equivalent of admin-on-rest's `<TextField>` component:

```js
import React, { PropTypes } from 'react';

const TextField = ({ source, record = {} }) => <span>{record[source]}</span>;

TextField.propTypes = {
    source: PropTypes.string.isRequired,
    record: PropTypes.object,
    label: PropTypes.string,
};

export default TextField;
```

**Tip**: The `label` attribute isn't used in the `render()` method, but admin-on-rest uses it to display the table header.

**Tip**: If you want to support deep field sources (e.g. source values like `author.name`), use `lodash.get` to replace the simple object lookup:

```js
import get from 'lodash.get';
const TextField = ({ source, record = {} }) => <span>{get(record, source)}</span>;
```

If you are not looking for reusability, you can create even simpler components, with no attributes. Let's say an API returns user records with `firstName` and `lastName` properties, and that you want to display a full name in a user list.

```js
{
    id: 123,
    firstName: 'John',
    lastName: 'Doe'
}
```

It's as easy as writing:

```js
import React, { PropTypes } from 'react';
import { List, Datagrid, TextField } from 'admin-on-rest/lib/mui';

const FullNameField = ({ record = {} }) => <span>{record.firstName} {record.lastName}</span>;
FullNameField.defaultProps = { label: 'Name' };

export const UserList = (props) => (
    <List {...props}>
        <Datagrid>
            <FullNameField />
        </Datagrid>
    </List>
);
```
