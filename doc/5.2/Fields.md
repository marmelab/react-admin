---
layout: default
title: "Field Components"
---

# Field Components

A `Field` component displays a given property of a record. Such components are used in the `List` and `Show` views, but you can also use them anywhere in your application, as long as there is a [`RecordContext`](./useRecordContext.md).

## Anatomy Of A Field

`Field` components read the current `record` from the current `RecordContext` (set by react-admin). There is nothing magic there - you can easily write your own:

{% raw %}
```jsx
import { useRecordContext } from 'react-admin';

const PurpleTextField = ({ source }) => {
    const record = useRecordContext();
    return (<span style={{ color: 'purple' }}>{record && record[source]}</span>);
};
```
{% endraw %}

**Tip**: Every time it renders a record, react-admin creates a `RecordContext`. This includes datagrid rows, simple list items, reference fields, show, and edit pages. You can even create a `RecordContext` yourself and use react-admin Fields in custom pages.

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

## Usage

To render a record field (e.g. `record.title`), choose the Field component that corresponds to the field type (e.g. `TextField` for a text field) and pass the field name (e.g. `title`) as the `source` prop.

So the following Show view:

```jsx
import { TextField } from 'react-admin';

export const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);
```

When rendered for the following record:

```js
{ 
    id: 123,
    title: "War And Peace",
}
```

Will render

```jsx
<Typography component="span" variant="body2">
    War And Peace
</Typography>
```

Field components are generally used in List and Show views, as children of `<Datagrid>`, `<SimpleShowLayout>`, and `<TabbedShowLayout>`. The parent component usually reads their `source` and/or `label` prop to add a title.

```jsx
// in src/posts.js
import * as React from "react";
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="teaser" />
            <RichTextField source="body" />
            <DateField label="Publication date" source="published_at" />
        </SimpleShowLayout>
    </Show>
);
```

![post show view](./img/post-show.png)

**Tip**: You can use field components inside the `Edit` and `Create` views, too, to render read-only values in a form:

```jsx
export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextField source="id" /> {/* read-only */}
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);
```

React-admin comes with about 20 field components, specialized in rendering numbers, image URLs, booleans, arrays, etc. And if you can't find a field for your need, you can always create your own.

## Common Field Props

All Field components accept the following props:

| Prop                          | Required | Type                           | Default  | Description                                                                                                                                             |
|-------------------------------| -------- |--------------------------------| -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`source`](#source)           | Required | `string`                       | -        | Name of the property to display                                                                                                                         |
| [`label`](#label)             | Optional | `string` &#124; `ReactElement` | `source` | Used as a Datagrid column header or in a Show layout                                                                                                    |
| [`record`](#record)           | Optional | `Object`                       | -        | Object containing the properties to display, to override the record from the current `RecordContext`                                                    |
| [`sortable`](#sortable)       | Optional | `boolean`                      | `true`   | When used in a `List`, should the list be sortable using the `source` attribute? Setting it to `false` disables the click handler on the column header. |
| [`sortBy`](#sortby)           | Optional | `string`                       | `source` | When used in a `List`, specifies the actual `source` to be used for sorting when the user clicks the column header                                      |
| [`sortByOrder`](#sortbyorder) | Optional | `ASC` &#124; `DESC`            | `ASC`    | When used in a `List`, specifies the sort order to be used for sorting when the user clicks the column header                                           |
| [`className`](#classname)     | Optional | `string`                       | -        | A class name (usually generated by JSS) to customize the look and feel of the field element itself                                                      |
| [`textAlign`](#textalign)     | Optional | `string`                       | 'left'   | Defines the text alignment inside a cell. Set to `right` for right alignment (e.g. for numbers)                                                         |
| [`emptyText`](#emptytext)     | Optional | `string`                       | ''       | Defines a text to be shown when a field has no value (not supported in array fields)                                                                    |
| [`sx`](#sx)                   | Optional | `SxProps`                      | ''       | Material UI shortcut for defining custom styles with access to the theme                                                                                        |

## `className`

CSS class name passed to the root component. 

```jsx
<TextField source="title" className="number" />
```

**Note**: To customize field styles, prefer [the `sx` prop](#sx).

## `emptyText`

By default, a Field renders an empty string when the record has no value for that field. You can override this behavior by setting the `emptyText` prop. The emptyText supports i8nProvider translation, if the translation is not found it will display the value as default.

```jsx
const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="title" />
            <TextField source="author" emptyText="missing data" />
        </Datagrid>
    </List>
);
```

## `label`

By default, a Field doesn't render any label - just the value. But when rendering several fields on the same screen, it's necessary to label them. That's why components like `<SimpleShowLayout>` and `<Datagrid>` read the field `source`, and use a humanized version as the label (e.g. `source="title"` gives the label `Title`). 

You can customize this automated label by specifying a `label` prop. `<SimpleShowLayout>` and `<Datagrid>` will then use the `label` prop instead of the `source` prop to label the field.

```jsx
// label can be a string
<TextField source="author.name" label="Author" />
// the label is automatically translated, so you can use translation identifiers
<TextField source="author.name" label="ra.field.author" />
// you can also use a React element
<TextField source="author.name" label={<FieldTitle label="Author" />} />
```

**Tip**: If your admin has to support multiple languages, don't use the `label` prop, and put the localized labels in a dictionary instead. See the [Translation documentation](./TranslationTranslating.md#translating-resource-and-field-names) for details.

**Tip**: You can opt out of the label decoration by passing `false` to the `label` prop.

```jsx
// No label will be added
<TextField source="author.name" label={false} />
```

**Note**: This prop has no effect when rendering a field outside a `<Datagrid>`, a `<SimpleShowLayout>`, a `<TabbedShowLayout>`, a `<SimpleForm>`, or a `<TabbedForm>`.

## `record`

By default, fields use the `record` from the `RecordContext`. But you can override it by passing the `record` prop - e.g. if you're rendering a field outside a `RecordContext`, or if you want to use a different record than the one in the context.

{% raw %}
```jsx
<TextField source="title" record={{ id: 123, title: "Hello" }} />
```
{% endraw %}

## `sortable`

In a `<Datagrid>`, users can change the sort field and order by clicking on the column headers. You may want to disable this behavior for a given field (e.g. for reference or computed fields). In that case, pass the `sortable` prop to `<Field>` with a `false` value.

```jsx
const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="title" />
            <ReferenceField source="author_id" sortable={false}>
                <TextField source="name" />
            </ReferenceField>
        </Datagrid>
    </List>
);
```

**Note**: This prop has no effect when rendering a field outside a `<Datagrid>`.

## `sortBy`

In a `<Datagrid>`, users can change the sort field and order by clicking on the column headers. `<Datagrid>` uses the Field `source`to determine the sort field (e.g. clicking on the column header for the `<TextField source="title" />` field sorts the list according to the `title` field).

You may want to use a different sort field than the `source`, e.g. for Reference fields. In that case, use the `sortBy` prop to specify the sort field.

```jsx
const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="title" />
            <ReferenceField source="author_id" sortBy="author.name">
                <TextField source="name" />
            </ReferenceField>
        </Datagrid>
    </List>
);
```

**Note**: This prop has no effect when rendering a field outside a `<Datagrid>`.

## `sortByOrder`

By default, when users click on a `<Datagrid>` column header, react-admin reorders the list using the field source, *with an ascending order*. For some fields, it brings unexpected results. For instance, when clicking on a "Last seen at" header, users probably expect to see the users seen more recently. 

You can change the default sort field order by using the `sortByOrder` prop.

```jsx
const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="title" />
            <DateField source="updated_at" sortByOrder="DESC" />
        </Datagrid>
    </List>
);
```

**Note**: This prop has no effect when rendering a field outside a `<Datagrid>`.

## `source`

The name of the property to display. Can contain dots for accessing properties of nested objects. 

```jsx
<TextField source="author.first_name" />
```

## `sx`

Like all react-admin components, you can customize the style of Field components using the `sx` prop. 

{% raw %}
```jsx
import { List, Datagrid, WrapperField, TextField } from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid>
            <ImageField source="avatar" sx={{ my: -2 }}/>
            <TextField source="username" sx={{ color: 'lightgrey' }} />
            <TextField source="email" sx={{ textOverflow: 'ellipsis' }} />
        </Datagrid>
    </List>
);
```
{% endraw %}

In addition to the root component, the `sx` prop also allows you to override the style of inner components. Refer to the documentation of each Field component to see the classes that you can override.

And see [the Material UI system documentation](https://mui.com/system/the-sx-prop/) for more information.

## `textAlign`

This prop defines the text alignment of the field when rendered inside a `<Datagrid>` cell. By default, datagrid values are left-aligned ; for numeric values, it's often better to right-align them. Set `textAlign` to `right` for that.

```jsx
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" textAlign="right" />
        </Datagrid>
    </List>
);
```

## Deep Field Source

Fields use the `source` as a *path* to read the actual value (using [`lodash.get()`](https://lodash.com/docs/4.17.15#get)). This means you can include dots in the source name to render a deeply nested value. 

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

This is particularly handy if your data provider supports [Relationship Embedding](./DataProviders.md#embedding-relationships).

```jsx
const { data } = useGetOne('posts', { id: 123, meta: { embed: ['author'] } });
```

## Setting A Field Label

<iframe src="https://www.youtube-nocookie.com/embed/fWc7c0URQMQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

React-admin Field layout components like [`<Datagrid>`](./Datagrid.md) and [`<SimpleShowLayout>`](./SimpleShowLayout.md) inspect their children and use their `label` prop to set the table headers or the field labels.

So inside these components, you can provide a `label` prop to override the default label.

```jsx
const BookList = () => (
   <List>
       <Datagrid>
            <TextField source="title" label="Post title" />
      </Datagrid>
  </List>
);
```

The label uses [the i18n layer](./Translation.md), so you can use a translation key, too:

```jsx
const BookList = () => (
   <List>
       <Datagrid>
            <TextField source="title" label="post.title" />
      </Datagrid>
  </List>
);
```

But as Field components don't render the label themselves (again, this is the responsibility of the parent layout component to render the label), this doesn't work when you use a Field inside a Form, or when the field isn't a direct child of a layout component.

To render a field with a label in such situations, wrap the field in [a `<Labeled>` component](./Labeled.md):

```jsx
const BookEdit = () => (
   <Edit>
       <SimpleForm>
            <Labeled label="Post title">
                <TextField source="title" />
            </Labeled>
      </SimpleForm>
  </Edit>
);
```

## Hiding The Field Label

React-admin Field layout components like [`<Datagrid>`](./Datagrid.md) and [`<SimpleShowLayout>`](./SimpleShowLayout.md) inspect their children and use their `source` prop to set the table headers or the field labels. To opt out of this behavior, pass `false` to the `label` prop.

```jsx
// No label will be added in SimpleShowLayout
<TextField source="author.name" label={false} />
```

## Conditional Formatting

If you want to format a field depending on the value, create another component wrapping this field, and set the `sx` prop depending on the field value:

{% raw %}
```jsx
const FormattedNumberField = ({ source }) => {
    const record = useRecordContext();
    return <NumberField sx={{ color: record && record[source] < 0 ? 'red' : '' }} source={source} />;
};
```
{% endraw %}


## Combining Two Fields

You may want to render more than one field per cell (in a `<Datagrid>`) or per row (in a `<SimpleShowLayout>`). 

In theory, you can simply put two fields inside a React Fragment (`<>`):

```jsx
const BookList = () => (
   <List>
       <Datagrid>
            <TextField source="title" />
            <>
                <TextField source="author_first_name" />
                <TextField source="author_last_name" />
            </>
      </Datagrid>
  </List>
);
```

This will render a 2-columns datagrid, one with the book title, and one with the book author. 

In practice, the result lacks a column title for the second column. As `<Datagrid>` looks for a `source` or a `label` in its children, it will not find a name for the second column.

There are two solutions. The first is to use `<WrapperField>`, which supports common field props (to allow inspection by parents) and renders its children:

```jsx
import { List, Datagrid, WrapperField, TextField } from 'react-admin';

const BookList = () => (
   <List>
       <Datagrid>
            <TextField source="title" />
            <WrapperField label="author" sortBy="author_last_name">
                <TextField source="author_first_name" />
                <TextField source="author_last_name" />
            </WrapperField>
      </Datagrid>
  </List>
);
```

The second solution is to use the [`<FunctionField>`](./FunctionField.md), which accepts a `render` function:

```jsx
import { List, Datagrid, WrapperField, FunctionField } from 'react-admin';

const BookList = () => (
   <List>
       <Datagrid>
            <TextField source="title" />
            <FunctionField label="author" sortBy="author.last_name" render={
                record => `${record.author.first_name} ${record.author.last_name}`
            } />
      </Datagrid>
  </List>
);
```

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

FullNameField.defaultProps = { label: 'Name' };
```

**Tip**: Always check the `record` is defined before inspecting its properties, as react-admin may display the Show view *before* fetching the record from the data provider. So the first time it renders the show view for a resource, the `record` is `undefined`.

You can now use this field like any other react-admin field:

```jsx
import { List, Datagrid } from 'react-admin';
import { FullNameField } from './FullNameField';

export const UserList = () => (
    <List>
        <Datagrid>
            <FullNameField source="lastName" />
        </Datagrid>
    </List>
);
```

**Tip**: In such custom fields, the `source` is optional. React-admin uses it to determine which column to use for sorting when the column header is clicked. In case you use the `source` property for additional purposes, the sorting can be overridden by the `sortBy` property on any `Field` component.

If you build a reusable field accepting a `source` props, you will probably want to support deep field sources (e.g. source values like `author.name`). Use the [`useFieldValue` hook](/useFieldValue.md) to replace the simple object lookup. For instance, for a Text field:

```diff
import * as React from 'react';
-import { useRecordContext } from 'react-admin';
+import { useFieldValue } from 'react-admin';

const TextField = (props) => {
-    const record = useRecordContext();
+   const value = useFieldValue(props);
-   return record ? <span>{record[props.source]}</span> : null;
+   return <span>{value}</span> : null;
}

export default TextField;
```

**Tip**: Note that when using `useFieldValue`, you don't need to check that `record` is defined.

## Hiding A Field Based On The Value Of Another

In a Show view, you may want to display or hide fields based on the value of another field - for instance, show an `email` field only if the `hasEmail` boolean field is `true`.

For such cases, you can use [the `<WithRecord>` component](./WithRecord.md), or the custom field approach: write a custom field that reads the `record` from the context, and renders another Field based on the value.

```jsx
import { Show, SimpleShowLayout, TextField, EmailField } from 'react-admin';

const ConditionalEmailField = () => {
    const record = useRecordContext();
    return record && record.hasEmail ? <EmailField source="email" /> : null;
}

const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ConditionalEmailField />
        </SimpleShowLayout>
    </Show>
);
```

This `<ConditionalEmailField>` is properly hidden when `hasEmail` is `false`. But the label for the field never renders. And if you add a `label` default prop, `SimpleShowLayout` layout will render the label regardless of the `hasEmail` value.

How about using React conditionals in `UserShow` to add the `<EmailField>` field only if the `record.hasEmail` is `true`? Unfortunately, the `useRecordContext()` hook doesn't work in `<UserShow>` (as it's the `<Show>` component's responsibility to fetch the record and put it into a context).

```jsx
const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            {/* Where can we get the record? */}
            {record.hasEmail && <EmailField source="email" />}
        </SimpleShowLayout>
    </Show>
);
```

The solution is to *split* the `<UserShow>` component into two: one that fetches the record, and one that renders the show layout. In descendants of `<Show>`, you can use the `useRecordContext()` hook.

```jsx
const UserShow = () => (
    <Show>
        <UserShowLayout />
    </Show>
);

const UserShowLayout = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            {record.hasEmail && <EmailField source="email" />}
        </SimpleShowLayout>
    );
};
```

And now you can use a regular Field component, and the label displays correctly in the Show view.

## Linking To Other Records

A custom Field component might need to display a link to another record. Build the URL to the distant record using the resource name and the id, as follows:

```js
import { useRecordContext, useGetOne } from 'react-admin';
import { Link } from 'react-router-dom';

const AuthorField = () => {
    const post = useRecordContext();
    const { data, isPending } = useGetOne('users', { id: post.user_id });
    const userShowPage = `/users/${post.user_id}/show`;

    return isPending ? null : <Link to={userShowPage}>{data.username}</Link>;
};
```

## Third-Party Components

You can find components for react-admin in third-party repositories.

- [OoDeLally/react-admin-clipboard-list-field](https://github.com/OoDeLally/react-admin-clipboard-list-field): a quick and customizable copy-to-clipboard field.
- [MrHertal/react-admin-json-view](https://github.com/MrHertal/react-admin-json-view): JSON field and input for react-admin.
- [alexgschwend/react-admin-color-picker](https://github.com/alexgschwend/react-admin-color-picker): a color field

## TypeScript

All field components accept a generic type that describes the record. This lets TypeScript validate that the `source` prop targets an actual field of the record:

```tsx
import * as React from "react";
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin';

// Note that you shouldn't extend RaRecord for this to work
type Post = {
    id: number;
    title: string;
    teaser: string;
    body: string;
    published_at: string;
}

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField<Post> source="title" />
            <TextField<Post> source="teaser" />
            {/* Here TS will show an error because a teasr field does not exist */}
            <TextField<Post> source="teasr" />
            <RichTextField<Post> source="body" />
            <DateField<Post> label="Publication date" source="published_at" />
        </SimpleShowLayout>
    </Show>
);
```

**Limitation**: You must not extend `RaRecord` for this to work or TypeScript would not be able to infer your types properties.

Specifying the record type will also allow your IDE to provide auto-completion for both the `source` and `sortBy` prop. Note that the `sortBy` prop also accepts any string.
