---
layout: default
title: "Input Components"
---

# Input Components

An `Input` component displays an input, or a dropdown list, a list of radio buttons, etc. Such components allow to edit a record property, and are common in the `<Edit>`, `<Create>`, and `<Filter>` views.

```js
// in src/posts.js
import React from 'react';
import { Edit, DisabledInput, LongTextInput, ReferenceInput, SelectInput, TextInput } from 'admin-on-rest/lib/mui';

export const PostEdit = (props) => (
    <Edit title={PostTitle} {...props}>
        <DisabledInput source="id" />
        <ReferenceInput label="User" source="userId" reference="users">
            <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="title" />
        <LongTextInput source="body" />
    </Edit>
);
```

All input components accept the following attributes:

* `source`: Property name of your entity to view/edit. This attribute is required.
* `label`: Used as a table header of an input label. Defaults to the `source` when omitted.

```js
<TextInput source="zb_title" label="Title" />
```

If you edit a record with a complex structure, you can use a path as the `source` parameter. For instance, if the API returns the following 'book' record:

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

Then you can display a text input to edit the author first name as follows:

```js
<TextInput source="author.firstName" />
```

## `<BooleanInput>` and `<NullableBooleanInput>`

`<BooleanInput />` is a toggle button allowing you to attribute a `true` or `false` value to a record field.

``` js
import { BooleanInput } from 'admin-on-rest/mui';

<BooleanInput label="Allow comments?" source="commentable" />
```

![BooleanInput](./img/boolean-input.png)

This input does not handle `null` values. You would need the `<NullableBooleanInput />` component if you have to handle non-set booleans.

`<NullableBooleanInput />` renders as a dropdown list, allowing to choose between true, false, and null values.

``` js
import { NullableBooleanInput } from 'admin-on-rest/mui';

<NullableBooleanInput label="Allow comments?" source="commentable" />
```

![NullableBooleanInput](./img/nullable-boolean-input.png)

## `<DateInput>`

Ideal for editing dates, `<DateInput>` renders a beautiful [Date Picker](http://www.material-ui.com/#/components/date-picker) with full localization support.

``` js
import { DateInput } from 'admin-on-rest/mui';

<DateInput source="published_at" />
```

![DateInput](./img/date-input.gif)

You can override any of Material UI's `<DatePicker>` attributes by setting the `options` attribute:

{% raw %}
``` js
<DateInput source="published_at" options={{
    mode: 'landscape',
    minDate: new Date(),
    hintText: 'Choisissez une date',
    DateTimeFormat,
    okLabel: 'OK',
    cancelLabel: 'Annuler'
    locale: 'fr'
}} />
```
{% endraw %}

Refer to [Material UI Datepicker documentation](http://www.material-ui.com/#/components/date-picker) for more details.

## `<DisabledInput>`

When you want to display a record property in an `<Edit>` form without letting users update it (such as for auto-incremented primary keys), use the `<DisabledInput>`:

``` js
import { DisabledInput } from 'admin-on-rest/mui';

<DisabledInput source="id" />
```

![DisabledInput](./img/disabled-input.png)

## `<LongTextInput>`

`<LongTextInput>` is the best choice for multiline text values. It renders as an auto expandable textarea.

``` js
import { LongTextInput } from 'admin-on-rest/mui';

<LongTextInput source="teaser" />
```

![LongTextInput](./img/long-text-input.png)

## `<RadioButtonGroupInput>`

If you want to let the user choose a value among a list of possible values by showing them all (instead of hiding them behind a dropdown list, as in [`<SelectInput>`](#selectinput)), `<RadioButtonGroupInput>` is the right component. Set the `choices` attribute to determine the options (with `id`, `name` tuples):

```js
import { Edit, RadioButtonGroupInput } from 'admin-on-rest/mui';

export const PostEdit = (props) => (
    <Edit {...props}>
        <RadioButtonGroupInput source="category" choices={[
            { id: 'programming', name: 'Programming' },
            { id: 'lifestyle', name: 'Lifestyle' },
            { id: 'photography', name: 'Photography' },
        ]} />
    </Edit>
);
```

![RadioButtonGroupInput](./img/radio-button-group-input.png)

You can also customize the properties to use for the option name and value, thanks to the `optionText` and `optionValue` attributes:

```js
<RadioButtonGroupInput label="Author" source="author_id" optionText="full_name" optionValue="_id" choices={[
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
]} />
```

## `<ReferenceInput>`

Use `<ReferenceInput>` for foreign-key values, i.e. to let users choose a value from another REST endpoint. This component fetches the possible values in the reference resource (using the `CRUD_GET_MATCHING` REST method), then delegates rendering to a subcomponent, to which it passs the possible choices as the `choices` attribute.

This means you can use `<ReferenceInput>` either with [`<SelectInput>`](#selectinput), or with [`<RadioButtonGroupInput>`](#radiobuttongroupinput), or even with the component of your choice, provided it supports the `choices` attribute.

The component expects a `source` and a `reference` attributes. For instance, to make the `post_id` for a `comment` editable:

```js
import { ReferenceInput, SelectInput } from 'admin-on-rest/mui'

export const CommentEdit = (props) => (
    <Edit {...props}>
        <DisabledInput source="id" />
        <ReferenceInput label="Post" source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
        <LongTextInput source="body" />
    </Edit>
);
```

![ReferenceInput](./img/reference-input.gif)

Set the `allowEmpty` attribute to `true` when the empty value is allowed. This is necessary for instance when used as a filter:

```js
const CommentFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput label="Post" source="post_id" reference="posts" allowEmpty>
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);
```

## `<RichTextInput>`

`<RichTextInput>` is the ideal component if you want to allow your users to edit some HTML contents. It
is powered by [Quill](https://quilljs.com/).

``` js
import { RichTextInput } from 'admin-on-rest/mui';

<RichTextInput source="body" />
```

![RichTextInput](./img/rich-text-input.png)

You can customize the rich text editor toolbar using the `toolbar` attribute, as described on the [Quill official toolbar documentation](https://quilljs.com/docs/modules/toolbar/).

```js
<RichTextInput source="body" toolbar={[ ['bold', 'italic', 'underline', 'link'] ]} />
```

## `<SelectInput>`

To let users choose a value in a list using a dropdown, use `<SelectInput>`. It renders using [Material ui's `<SelectField>`](http://www.material-ui.com/#/components/select-field). Set the `choices` attribute to determine the options (with `id`, `name` tuples):

```js
import { Edit, SelectInput } from 'admin-on-rest/mui';

export const PostEdit = (props) => (
    <Edit {...props}>
        <SelectInput source="category" choices={[
            { id: 'programming', name: 'Programming' },
            { id: 'lifestyle', name: 'Lifestyle' },
            { id: 'photography', name: 'Photography' },
        ]} />
    </Edit>
);
```

![SelectInput](./img/select-input.gif)

You can also customize the properties to use for the option name and value, thanks to the `optionText` and `optionValue` attributes:

```js
<SelectInput label="Author" source="author_id" optionText="full_name" optionValue="_id" choices={[
    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
]} />
```

Enabling the `allowEmpty` props adds an empty choice (with `null` value) on top of the options, and makes the value nullable:

```js
<SelectInput source="category" allowEmpty choices={[
    { id: 'programming', name: 'Programming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'photography', name: 'Photography' },
]} />
```

Lastly, use the `options` attribute if you want to override any of Material UI's `<SelectField>` attributes:

{% raw %}
```js
<SelectInput source="category" options={{
    maxHeight: 200
}} />
```
{% endraw %}

Refer to [Material UI SelectField documentation](http://www.material-ui.com/#/components/select-field) for more details.

And if, instead of showing choices as a dropdown list, you prefer to display them as a list of radio buttons, try the [`<RadioButtonGroupInput>`](#radiobuttongroupinput).

## `<TextInput>`

`<TextInput>` is the most common input. It is used for texts, emails, URL or passwords. In translates to an HTML `<input>` tag.

``` js
import { TextInput } from 'admin-on-rest/mui';

<TextInput source="title" />
```

![TextInput](./img/text-input.png)

You can choose a specific input type using the `type` attribute, among `text` (the default), `email`, `url`, or `password`:

``` js
<TextInput label="Email Address" source="email" type="email" />
```

## Writing Your Own Input Component

If you need a more specific input type, you can also write it yourself. In addition to `source` and `label` attributes, it must accept an `input` attribute to integrate with admin-on-rest forms (powered by redux-form). Admin-on-rest will inject the `input` attribute at runtime, and it will contain a `value` (computed from the current record and source), and an `onChange` function (to manage the input).

For instance, here is an simplified version of admin-on-rest's `<TextInput>` component:

```js
import React, { PropTypes } from 'react';

const TextInput = ({ source, label, input }) => (
    <span>
        <label for={source}>{label}</label>
        <input name={source} value={input.value} onChange={input.onChange} type="text" />
    </span>
);

TextInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    source: PropTypes.string.isRequired,
};

TextInput.defaultProps = {
    includesLabel: true,
};

export default TextInput;
```

**Tip**: Admin-on-rest inspects the `includesLabel` attribute to determine whether to render an additional label on top of the input component or not. If `includesLabel` is false, admin-on-rest considers the components doesn't have its own label, and adds another one.
