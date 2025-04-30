---
layout: default
title: "ShowDialog"
---

# `<ShowDialog>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> component offers a replacement to [the `<Show>` component](./Show.md) allowing users to visualize a record without leaving the context of the list page.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-form-layout/latest/InDialogButtons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

First, install the `@react-admin/ra-form-layout` package:

```sh
npm install --save @react-admin/ra-form-layout
# or
yarn add @react-admin/ra-form-layout
```

**Tip**: [`ra-form-layout`](https://react-admin-ee.marmelab.com/documentation/ra-form-layout#createdialog-editdialog--showdialog) is hosted in a private npm registry. You need to subscribe to one of the [Enterprise Edition](https://react-admin-ee.marmelab.com/) plans to access this package.

Then, add the `<ShowDialog>` component as a sibling to a `<List>` component.

```jsx
import {
    List,
    Datagrid,
    ShowButton,
    SimpleShowLayout,
    TextField,
    DateField,
} from 'react-admin';
import { ShowDialog } from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List>
            <Datagrid>
                ...
                <ShowButton />
            </Datagrid>
        </List>
        <ShowDialog>
            <SimpleShowLayout>
                <TextField source="first_name" />
                <TextField source="last_name" />
                <DateField source="date_of_birth" />
            </SimpleShowLayout>
        </ShowDialog>
    </>
);
```

In the related `<Resource>`, you don't need to declare a `show` component as the showing UI is part of the `list` component:

```jsx
<Resource name="customers" list={CustomerList} />
```

## Props

`<ShowDialog>` accepts the following props:

| Prop               | Required | Type              | Default | Description                                                                |
| ------------------ | -------- | ----------------- | ------- | -------------------------------------------------------------------------- |
| `children`         | Required | `ReactNode`       |         | The content of the dialog                                                  |
| `fullWidth`        | Optional | `boolean`         | `false` | If `true`, the dialog stretches to the full width of the screen            |
| `id`               | Optional | `string | number` |         | The record id. If not provided, it will be deduced from the record context |
| `maxWidth`         | Optional | `string`          | `sm`    | The max width of the dialog                                                |
| `queryOptions`     | Optional | `object`          |         | The options to pass to the `useQuery` hook                                 |
| `resource`         | Optional | `string`          |         | The resource name, e.g. `posts`                                            |
| `sx`               | Optional | `object`          |         | Override the styles applied to the dialog component                        |
| `title`            | Optional | `ReactNode`       |         | The title of the dialog                                                    |

## `children`

`<ShowDialog>` doesn't render any field by default - it delegates this to its children, usually [a `SimpleShowLayout` component](./SimpleShowLayout.md).

React-admin also provides [`TabbedShowLayout`](./TabbedShowLayout.md), another layout component rendering tabs.

To use it, switch the `<ShowDialog>` child component:

```diff
const MyShowDialog = () => (
    <ShowDialog>
-       <SimpleShowLayout>
+       <TabbedShowLayout>
+           <TabbedShowLayout.Tab label="Identity">
                <TextField source="first_name" />
                <TextField source="last_name" />
+           </TabbedShowLayout.Tab>
+           <TabbedShowLayout.Tab label="Informations">
                <DateField source="dob" label="born" />
                <SelectField source="sex" choices={sexChoices} />
+           </TabbedShowLayout.Tab>
-       </SimpleShowLayout>
+       </TabbedShowLayout>
    </ShowDialog>
);
```

## `fullWidth`

By default, `<ShowDialog>` renders a [Material UI `<Dialog>`](https://mui.com/material-ui/react-dialog/#full-screen-dialogs) component that takes the width of its content.

You can make the dialog full width by setting the `fullWidth` prop to `true`:

```jsx
const MyShowDialog = () => (
  <ShowDialog fullWidth>
      ...
  </ShowDialog>
);
```

In addition, you can set a dialog maximum width by using the `maxWidth` enumerable in combination with the `fullWidth` boolean. When the `fullWidth` prop is true, the dialog will adapt based on the `maxWidth` value.

```jsx
const MyShowDialog = () => (
  <ShowDialog fullWidth maxWidth="sm">
      ...
  </ShowDialog>
);
```

## `id`

The `id` prop allows you to pass the record id to the `<ShowDialog>` component. If not provided, it will be deduced from the record context.

This is useful to link to a related record. For instance, the following dialog lets you show the author of a book:

```jsx
const ShowAuthorDialog = () => {
  const book = useRecordContext();
  return (
    <ShowDialog resource="authors" id={book.author_id}>
        ...
    </ShowDialog>
  );
};
```

## `maxWidth`

The `maxWidth` prop allows you to set the max width of the dialog. It can be one of the following values: `xs`, `sm`, `md`, `lg`, `xl`, `false`. The default is `sm`.

For example, you can use that prop to make the dialog full width:

```jsx
const MyShowDialog = () => (
  <ShowDialog fullWidth maxWidth={false}>
      ...
  </ShowDialog>
);
```

## `queryOptions`

The `queryOptions` prop allows you to pass options to the `useQuery` hook. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getOne()` call.

{% raw %}

```jsx
const MyShowDialog = () => (
  <ShowDialog queryOptions={{ meta: { fetch: 'author' } }}>
      ...
  </ShowDialog>
);
```

{% endraw %}

## `resource`

The `resource` prop allows you to pass the resource name to the `<ShowDialog>` component. If not provided, it will be deduced from the resource context.

This is useful to link to a related record. For instance, the following dialog lets you show the author of a book:

```jsx
const ShowAuthorDialog = () => {
  const book = useRecordContext();
  return (
    <ShowDialog resource="authors" id={book.author_id}>
        ...
    </ShowDialog>
  );
};
```

## `sx`

Customize the styles applied to the Material UI `<Dialog>` component:

{% raw %}

```jsx
const MyShowDialog = () => (
  <ShowDialog sx={{ backgroundColor: 'paper' }}>
      ...
  </ShowDialog>
);
```

{% endraw %}

## `title`

Unlike the `<Show>` components, with Dialog components the title will be displayed in the `<Dialog>`, not in the `<AppBar>`.
If you pass a custom title component, it will render in the same `RecordContext` as the dialog's child component. That means you can display non-editable details of the current `record` in the title component.
Here is an example:

```tsx
import React from 'react';
import {
    List,
    Datagrid,
    SimpleShowLayout,
    TextField,
    DateField,
    required,
    useRecordContext,
    ShowButton,
} from 'react-admin';
import { ShowDialog } from '@react-admin/ra-form-layout';

const CustomerShowTitle = () => {
    const record = useRecordContext();
    return record ? (
        <span>
            Show {record?.last_name} {record?.first_name}
        </span>
    ) : null;
};

const CustomerList = () => (
    <>
        <List>
            <Datagrid>
                ...
                <ShowButton />
            </Datagrid>
        </List>
        <ShowDialog title={<CustomerShowTitle />}>
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="first_name" />
                <TextField source="last_name" />
                <DateField source="date_of_birth" label="born" />
            </SimpleShowLayout>
        </EditDialog>
    </>
);
```

You can also hide the title by passing `null`:

```tsx
<ShowDialog title={null}>
    <SimpleShowLayout>
        ...
    </SimpleShowLayout>
</ShowDialog>
```

## Usage Without Routing

By default, `<ShowDialog>` creates a react-router `<Route>` for the displaying path (e.g. `/posts/2/show`), and renders when users go to that location (either by clicking on a datagrid row, or by typing the URL in the browser). If you embed it in the `list` page as explained above, the dialog will always render on top of the list.

This may not be what you want if you need to display the show dialog in another page (e.g. to show a related record).

In that case, use [the `<ShowInDialogButton>` component](./ShowInDialogButton.md), which doesn't create a route, but renders the dialog when the user clicks on it.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-form-layout/latest/InDialogButtons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

Put `<ShowInDialogButton>` wherever you would put a `<ShowButton>`, and use the same children as you would for a `<Show>` component (e.g. a `<SimpleShowLayout>`):

```jsx
import {
  Datagrid,
  ReferenceManyField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";
import { ShowInDialogButton } from "@react-admin/ra-form-layout";

const CompanyShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <TextField source="address" />
            <TextField source="city" />
            <ReferenceManyField target="company_id" reference="employees">
                <Datagrid>
                    <TextField source="first_name" />
                    <TextField source="last_name" />
                    <ShowInDialogButton>
                        <SimpleShowLayout>
                            <TextField source="first_name" />
                            <TextField source="last_name" />
                        </SimpleShowLayout>
                    </ShowInDialogButton>
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
```

Check [the `<ShowInDialogButton>` component](./ShowInDialogButton.md) for more details.
