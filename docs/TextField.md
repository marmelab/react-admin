---
layout: default
title: "The TextField Component"
---

# `<TextField>`

The simplest of all fields, `<TextField>` simply displays the record property as plain text.

```jsx
import { TextField } from 'react-admin';

<TextField source="name" />
// renders the record { id: 1234, name: 'John Doe' } as
// <span>John Doe</span>
```

`<TextField>` grabs the `record` from the current [`RecordContext`](./useRecordContext.md), extracts the value of the `source` property, and displays it inside a Material UI `<Typography>` component.

## Usage

Use `<TextField>` as descendent of:

- a record detail component (`<Show>`, `<Edit>`),
- a layout component for a list of records (`<Datagrid>`, `<SimpleList>`, `<SingleFieldList>`)
- a [`RecordContextProvider`](./useRecordContext.md#creating-a-record-context)

For instance, to render the title and teaser of a post in a show view:

```jsx
import { Show, SimpleShowLayout, TextField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="teaser" />
        </SimpleShowLayout>
    </Show>
);
```

`<TextField>` requires a `source` prop to specify which property of the record is rendered. It can be a [deep source](./Fields.md#deep-field-source) (e.g. "author.name").

It also accepts [common field props](./Fields.md#common-field-props) such as the `sx` prop to override its style.

Additional props are passed down to the underlying [Material UI `<Typography>` component](https://mui.com/material-ui/react-typography/).

## Displaying Values From More Than One Source

If you want to display data from more than one field, check out the [`<FunctionField>`](./FunctionField.md), which accepts a `render` function:

```jsx
import { FunctionField } from 'react-admin';

<FunctionField
    label="Name"
    render={record => `${record.first_name} ${record.last_name}`}
/>;
```

## Edit In Place

In addition to rendering a field value, you may want to allow users to edit that value. You can redirect the user to an `<Edit>` page, or you can use the [`<InPlaceEditor>`](./InPlaceEditor.md) component to edit the value directly in the list or show view. 



<video controls autoplay playsinline muted loop>
  <source src="./img/InPlaceEditor.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

`<InPlaceEditor>` renders a `<TextField>` by default, and turns into a `<TextInput>` when the user clicks on it. It is useful for quick edits without navigating to a separate edit page.

{% raw %}
```tsx
import { Show, InPlaceEditor } from 'react-admin';
import { Stack, Box, Typography } from '@mui/material';

const CustomerShow = () => (
    <Show>
        <Stack direction="row" spacing={2}>
            <AvatarField />
            <CustomerActions />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>Phone</Typography>
                <InPlaceEditor source="phone" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography>Email</Typography>
                <InPlaceEditor source="email" />
            </Box>
            ...
        </Stack>
    </Show>
);
```
{% endraw %}

Check out [the `<InPlaceEditor>` documentation](./InPlaceEditor.md) for more details.
