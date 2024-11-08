---
layout: default
title: "Buttons"
---

# Buttons

React-Admin provides button components for all the common uses.

- **Navigation Buttons**: to navigate between the various react-admin views.
    - [`<EditButton>`](#editbutton)
    - [`<ShowButton>`](#showbutton)
    - [`<CreateButton>`](#createbutton)
    - [`<ListButton>`](#listbutton)

- **List Buttons**: to be used in List views.
    - [`<ExportButton>`](#exportbutton)
    - [`<BulkExportButton>`](#bulkexportbutton)
    - [`<BulkDeleteButton>`](#bulkdeletebutton)
    - [`<BulkUpdateButton>`](#bulkupdatebutton)
    - [`<BulkUpdateFormButton>`](#bulkupdateformbutton)
    - [`<FilterButton>`](#filterbutton)

- **Record Buttons**: To be used in detail views
    - [`<UpdateButton>`](#updatebutton)
    - [`<DeleteButton>`](#deletebutton)
    - [`<DeleteWithConfirmButton>`](#deletewithconfirmbutton)
    - [`<CloneButton>`](#clonebutton)

- **Miscellaneous**
    - [`<Button>`](#button)
    - [`<RefreshButton>`](#refreshbutton)
    - [`<SkipNavigationButton>`](#skipnavigationbutton)
    - [`<UserMenu>`](#usermenu)

## `<BulkDeleteButton>`

Deletes the selected rows. To be used inside [the `<Datagrid bulkActionButtons>` prop](./Datagrid.md#bulkactionbuttons) (where it's enabled by default).

![Bulk Delete button](./img/bulk-delete-button.png)

### Usage

`<BulkDeleteButton>` reads the current record from `RecordContext`, and the current resource from `ResourceContext`, so in general it doesn’t need any props:

```jsx
import * as React from 'react';
import { Fragment } from 'react';
import { BulkDeleteButton, BulkExportButton } from 'react-admin';

const PostBulkActionButtons = () => (
    <Fragment>
        <BulkExportButton />
        <BulkDeleteButton />
    </Fragment>
);

export const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
        </Datagrid>
    </List>
);
```

### Props

| Prop              | Required | Type                                    | Default                  | Description                                                                                                                          |
|-------------------|----------|-----------------------------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `confirmContent`  | Optional | React node                              | -                        | Lets you customize the content of the confirm dialog. Only used in `'pessimistic'` or `'optimistic'` mutation modes                  |
| `confirmTitle`    | Optional | `string`                                | -                        | Lets you customize the title of the confirm dialog. Only used in `'pessimistic'` or `'optimistic'` mutation modes                    |
| `confirmColor`    | Optional | <code>'primary' &#124; 'warning'</code> | 'primary'                | Lets you customize the color of the confirm dialog's "Confirm" button. Only used in `'pessimistic'` or `'optimistic'` mutation modes |
| `label`           | Optional | `string`                                | 'ra.action.delete'       | label or translation message to use                                                                                                  |
| `icon`            | Optional | `ReactElement`                          | `<DeleteIcon>`           | iconElement, e.g. `<CommentIcon />`                                                                                                  |
| `mutationMode`    | Optional | `string`                                | `'undoable'`             | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)                                                                      |
| `mutationOptions` | Optional | `object`                                | null                     | options for react-query `useMutation` hook                                                                                           |
| `successMessage`  | Optional | `string`                                | 'ra.notification.deleted'| Lets you customize the success notification message.                                                                                 |

**Tip:** If you choose the `'pessimistic'` or `'optimistic'` mutation mode, a confirm dialog will be displayed to the user before the mutation is executed.

### `successMessage`

![Delete button success message](./img/BulkDeleteButton_Success.png)

On success, `<BulkDeleteButton>` displays a "XX elements deleted" notification in English. `<BulkDeleteButton>` uses two successive translation keys to build the success message:

- `resources.{resource}.notifications.deleted` as a first choice
- `ra.notification.deleted` as a fallback

To customize the notification message, you can set custom translation for these keys in your i18nProvider.

**Tip**: If you choose to use a custom translation, be aware that react-admin uses the same translation message for the `<DeleteButton>`, so the message must support [pluralization](./TranslationTranslating.md#interpolation-pluralization-and-default-translation):

```jsx
const englishMessages = {
    resources: {
        posts: {
            notifications: {
                deleted: 'Post deleted |||| %{smart_count} postss deleted',
                // ...
            },
        },
    },
};
```

Alternately, pass a `successMessage` prop:

```jsx
<BulkDeleteButton successMessage="Posts deleted successfully" />
```

## `<BulkExportButton>`

Same as `<ExportButton>`, except it only exports the selected rows instead of the entire list. To be used inside [the `<Datagrid bulkActionButtons>` prop](./Datagrid.md#bulkactionbuttons).

![Bulk Export button](./img/bulk-export-button.png)

### Usage

```jsx
import * as React from 'react';
import { Fragment } from 'react';
import { BulkDeleteButton, BulkExportButton } from 'react-admin';

const PostBulkActionButtons = () => (
    <Fragment>
        <BulkExportButton />
        <BulkDeleteButton />
    </Fragment>
);

export const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
        </Datagrid>
    </List>
);
```

### Props

| Prop         | Required | Type            | Default            | Description                         |
| ------------ | -------- | --------------- | ------------------ | ----------------------------------- |
| `label`      | Optional | `string`        | 'ra.action.export' | label or translation message to use |
| `icon`       | Optional | `ReactElement`  | `<DownloadIcon>`   | iconElement, e.g. `<CommentIcon />` |
| `exporter`   | Optional | `Function`      | -                  | Override the List exporter function |
| `meta`       | Optional | `any`           | undefined          | Metadata passed to the dataProvider |

## `<BulkUpdateButton>`

Partially updates the selected rows. To be used inside [the `<Datagrid bulkActionButtons>` prop](./Datagrid.md#bulkactionbuttons).

![Bulk Update button](./img/bulk-update-button.png)

### Usage

{% raw %}
```jsx
import * as React from 'react';
import { Fragment } from 'react';
import { BulkDeleteButton, BulkExportButton, BulkUpdateButton } from 'react-admin';

const PostBulkActionButtons = () => (
    <Fragment>
        <BulkExportButton />
        <BulkUpdateButton data={{ published_at: new Date() }} />
        <BulkDeleteButton />
    </Fragment>
);

export const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
            ...
        </Datagrid>
    </List>
);
```
{% endraw %}

### Props

| Prop              | Required | Type           | Default            | Description                                                                                                         |
|-------------------|----------|----------------|--------------------|---------------------------------------------------------------------------------------------------------------------|
| `data`            | Required | `object`       | -                  | An object with the fields that need to be updated on the selected records                                           |
| `confirmContent`  | Optional | React node     | -                  | Lets you customize the content of the confirm dialog. Only used in `'pessimistic'` or `'optimistic'` mutation modes |
| `confirmTitle`    | Optional | `string`       | -                  | Lets you customize the title of the confirm dialog. Only used in `'pessimistic'` or `'optimistic'` mutation modes   |
| `icon`            | Optional | `ReactElement` | `<ActionUpdate>`   | An icon element                                                                                                     |
| `label`           | Optional | `string`       | 'ra.action.update' | Label or translation message to use                                                                                 |
| `mutationMode`    | Optional | `string`       | `'undoable'`       | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)                                                     |
| `mutationOptions` | Optional | `object`       | null               | Options for react-query `useMutation` hook                                                                          |
| `successMessage`  | Optional | `string`       | 'ra.notification.updated'| Lets you customize the success notification message.                                                          |

**Tip:** If you choose the `'pessimistic'` or `'optimistic'` mutation mode, a confirm dialog will be displayed to the user before the mutation is executed.

### `successMessage`

On success, `<BulkUpdateButton>` displays a "XX elements updated" notification in English. `<BulkUpdateButton>` uses two successive translation keys to build the success message:

- `resources.{resource}.notifications.updated` as a first choice
- `ra.notification.updated` as a fallback

To customize the notification message, you can set custom translation for these keys in your i18nProvider.

**Tip**: If you choose to use a custom translation, be aware that react-admin uses the same translation message for the `<Edit>` success notification, so the message must support [pluralization](./TranslationTranslating.md#interpolation-pluralization-and-default-translation):

```jsx
const englishMessages = {
    resources: {
        posts: {
            notifications: {
                updated: 'Post updated |||| %{smart_count} postss updated',
                // ...
            },
        },
    },
};
```

Alternately, pass a `successMessage` prop:

{% raw %}
```jsx
<BulkUpdateButton
    data={{ published_at: new Date() }}
    successMessage="Posts deleted successfully"
/>
```
{% endraw %}

## `<BulkUpdateFormButton>`

This component, part of the [enterprise edition](https://react-admin-ee.marmelab.com/documentation/ra-form-layout)<img class="icon" src="./img/premium.svg" />, lets users edit multiple records at once. To be used inside [the `<Datagrid bulkActionButtons>` prop](./Datagrid.md#bulkactionbuttons).

<video controls autoplay playsinline muted loop>
  <source src="./img/BulkUpdateButton-SimpleForm.webm" type="video/webm"/>
  <source src="./img/BulkUpdateButton-SimpleForm.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The button opens a dialog containing the form passed as children. When the form is submitted, it will call the dataProvider's `updateMany` method with the ids of the selected records.

### Usage

`<BulkUpdateFormButton>` can be used inside `<Datagrid>`'s `bulkActionButtons`.

```tsx
import * as React from 'react';
import {
    Admin,
    BooleanField,
    BooleanInput,
    Datagrid,
    DateField,
    DateInput,
    List,
    Resource,
    SimpleForm,
    TextField,
} from 'react-admin';
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';

import { dataProvider } from './dataProvider';
import { i18nProvider } from './i18nProvider';

export const App = () => (
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);

const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkUpdateButton />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
        </Datagrid>
    </List>
);
```

**Tip:** You are not limited to using a `<SimpleForm>` as children. You can for instance use an `<InputSelectorForm>`, which allows to select the fields to update. Check out the [`<InputSelectorForm>`](#usage-with-inputselectorform) below for more information.

### Props

| Prop              | Required     | Type     | Default         | Description                                                                                                                        |
|-------------------|--------------|----------|-----------------|------------------------------------------------------------------------------------------------------------------------------------|
| `children`        | Required (*) | Element  | -               | A form component to render inside the Dialog                                                                                       |
| `DialogProps`     | -            | Object   | -               | Additional props to pass to the [MUI Dialog](https://mui.com/material-ui/react-dialog/)                                            |
| `mutationMode`    | -            | `string` | `'pessimistic'` | The mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)                                                                |
| `mutationOptions` | -            | Object   | -               | Mutation options passed to [React Query](https://tanstack.com/query/v5/docs/react/reference/useMutation) when calling `updateMany` |


### `children`

`<BulkUpdateFormButton>` expects a form component as children, such as `<SimpleForm>` or `<InputSelectorForm>`.

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

### `DialogProps`

The `DialogProps` prop can be used to pass additional props to the [MUI Dialog](https://mui.com/material-ui/react-dialog/).
{% raw %}
```tsx
import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const PostBulkUpdateButtonWithTransition = () => (
    <BulkUpdateFormButton DialogProps={{ TransitionComponent: Transition }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```
{% endraw %}

### `mutationMode`

Use the `mutationMode` prop to specify the [mutation mode](https://marmelab.com/react-admin/Edit.html#mutationmode).

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton mutationMode="undoable">
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

### `mutationOptions` and `meta`

The `mutationOptions` prop can be used to pass options to the [react-query mutation](https://react-query.tanstack.com/reference/useMutation#options) used to call the dataProvider's `updateMany` method.

{% raw %}
```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton mutationOptions={{ retry: false }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```
{% endraw %}

You can also use this prop to pass a `meta` object, that will be passed to the dataProvider when calling `updateMany`.
{% raw %}
```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton mutationOptions={{ meta: { foo: 'bar' } }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```
{% endraw %}

### Usage with `<TabbedForm>` or other location based form layouts

`<BulkUpdateFormButton>` can be used with any form layout. However, for form layouts that are based on location by default, such as [`<TabbedForm>`](https://marmelab.com/react-admin/TabbedForm.html), you will need to disable the location syncing feature, as it may conflict with the Edit route declared by React Admin (`/<resource>/<id>`).

For instance, with `<TabbedForm>`, you can use the `syncWithLocation` prop to disable it:

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, TabbedForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <TabbedForm syncWithLocation={false}>
            <TabbedForm.Tab label="Publication">
                <DateInput source="published_at" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Visibility">
                <BooleanInput source="is_public" />
            </TabbedForm.Tab>
        </TabbedForm>
    </BulkUpdateFormButton>
);
```

### Usage With `<InputSelectorForm>`

`<BulkUpdateFormButton>` works best with `<InputSelectorForm>`, which component renders a form allowing to select the fields to update in a record.

<video controls autoplay playsinline muted loop>
  <source src="./img/BulkUpdateButton-InputSelectorForm.webm" type="video/webm"/>
  <source src="./img/BulkUpdateButton-InputSelectorForm.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

`<InputSelectorForm>` expects a list of inputs passed in the `inputs` prop. Each input must have a `label` and an `element`.

```tsx
import {
    BulkUpdateFormButton,
    InputSelectorForm,
} from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <InputSelectorForm
            inputs={[
                {
                    label: 'Published at',
                    element: <DateInput source="published_at" />,
                },
                {
                    label: 'Is public',
                    element: <BooleanInput source="is_public" />,
                },
            ]}
        />
    </BulkUpdateFormButton>
);
```

Use the `inputs` prop to specify the list of inputs from which the user can pick. Each input must have a `label` and an `element`.

```tsx
import { InputSelectorForm } from '@react-admin/ra-form-layout';
import * as React from 'react';
import {
    BooleanInput,
    DateInput,
    SelectArrayInput,
    TextInput,
} from 'react-admin';

const PostEdit = () => (
    <InputSelectorForm
        inputs={[
            {
                label: 'Title',
                element: <TextInput source="title" />,
            },
            {
                label: 'Body',
                element: <TextInput source="body" multiline />,
            },
            {
                label: 'Published at',
                element: <DateInput source="published_at" />,
            },
            {
                label: 'Is public',
                element: <BooleanInput source="is_public" />,
            },
            {
                label: 'Tags',
                element: (
                    <SelectArrayInput
                        source="tags"
                        choices={[
                            { id: 'react', name: 'React' },
                            { id: 'vue', name: 'Vue' },
                            { id: 'solid', name: 'Solid' },
                            { id: 'programming', name: 'Programming' },
                        ]}
                    />
                ),
            },
        ]}
    />
);
```

### Limitations

If you look under the hood, you will see that `<BulkUpdateFormButton>` provides a `<SaveContext>` to its children, which allows them to call `updateMany` with the ids of the selected records.

However since we are in the context of a list, there is no `<RecordContext>` available. Hence, the following inputs cannot work inside a `<BulkUpdateFormButton>`:

- `<ReferenceOneInput>`
- `<ReferenceManyInput>`
- `<ReferenceManyToManyInput>`

## `<Button>`

Base component for most react-admin buttons. Responsive (displays only the icon with a tooltip on mobile) and accessible.

### Props

| Prop         | Required | Type                           | Default | Description                              |
| ------------ | -------- | ------------------------------ | ------- | ---------------------------------------- |
| `alignIcon`  | Optional | `'left' | 'right`              | `'left'` | Icon position relative to the label     |
| `children`   | Optional | `ReactElement`                 | -        | icon to use                             |
| `className`  | Optional | `string`                       | -        | Class name to customize the look and feel of the button element itself          |
| `color`      | Optional | `'default' | 'inherit'| 'primary' | 'secondary'` | `'primary'` | Label and icon color |
| `disabled`   | Optional | `boolean`                      | `false`   | If `true`, the button will be disabled |
| `size`       | Optional | `'large' | 'medium' | 'small'` | `'small'` | Button size                            |

Other props are passed down to [the underlying Material UI `<Button>`](https://mui.com/material-ui/api/button/).

### `sx`: CSS API

| Rule name                    | Description                                                                                     |
|------------------------------|-------------------------------------------------------------------------------------------------|
| `& .RaButton-button`         | Applied to the underlying `MuiButton` component                                                 |
| `& .RaButton-label`          | Applied to the Button's label when `alignIcon` prop is 'left'                                   |
| `& .RaButton-labelRightIcon` | Applied to the Button's label when `alignIcon` prop is 'left'                                   |
| `& .RaButton-smallIcon`      | Applied to the Button's `children` when `size` prop is `small` and `alignIcon` prop is 'right'  |
| `& .RaButton-mediumIcon`     | Applied to the Button's `children` when `size` prop is `medium` and `alignIcon` prop is 'right' |
| `& .RaButton-largeIcon`      | Applied to the Button's `children` when `size` prop is `large` and `alignIcon` prop is 'right'  |

To override the style of all instances of `<Button>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaButton` key.

## `<CloneButton>`

## `<CreateButton>`

Opens the Create view of the current resource:

![Create button](./img/create-button.png)

On mobile, it turns into a "Floating Action Button".

![Create button FAB](./img/create-button-fab.png)

### Usage

`<CreateButton>` reads the current resource from `ResourceContext`, so in general it doesn't need any props:

```jsx
import { CreateButton, TopToolbar, List } from 'react-admin';

const ListActions = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

const CommentList = () => (
    <List actions={<ListActions />}>
        {/* ... */}
    </List>
);
```

`<CreateButton>` is based on react-admin's base `<Button>`, so it's responsive, accessible, and the label is translatable.

### Props

| Prop          | Required | Type            | Default            | Description                                  |
| ------------- | -------- | --------------- | ------------------ | -------------------------------------------- |
| `resource`    | Optional | `string`        | -                  | Target resource, e.g. 'posts'                |
| `label`       | Optional | `string`        | 'ra.action.create' | label or translation message to use          |
| `icon`        | Optional | `ReactElement`  | -                  | iconElement, e.g. `<CommentIcon />`          |
| `scrollToTop` | Optional | `boolean`       | `true`             | Scroll to top after link                     |

It also supports [all the other `<Button>` props](#button).

**Tip**: If you want to link to the Create view manually, use the `/{resource}/create` location.

**Tip:** To allow users to create a record without leaving the current view, use the [`<CreateInDialogButton>`](./CreateInDialogButton.md) component.

### `sx`: CSS API

| Rule name                   | Description                                                        |
|-----------------------------|--------------------------------------------------------------------|
| `&.RaCreateButton-floating` | Applied to the underlying `MuiFab` component used in small screens |

To override the style of all instances of `<CreateButton>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaCreateButton` key.

### Access Control

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<CreateButton>` will only render if the user has the "create" access to the related resource.

`<CreateButton>` will call `authProvider.canAccess()` using the following parameters:

```txt
{ action: "create", resource: [current resource] }
```

## `<DeleteButton>`

Delete the current record.

![Delete button](./img/DeleteButton.png)

### Usage

`<DeleteButton>` reads the current record from `RecordContext`, and the current resource from `ResourceContext`, so in general it doesn't need any props:

```jsx
import { DeleteButton } from 'react-admin';

const CommentShow = () => (
    <>
        {/* ... */}
        <DeleteButton />
    </>
);
```

When pressed, it will call `dataProvider.delete()` with the current record's `id`.

You can also call it with a record and a resource:

{% raw %}
```jsx
<DeleteButton record={{ id: 123, author: 'John Doe' }} resource="comments" />
```
{% endraw %}

### Props

| Prop                | Required | Type                             | Default           | Description                                                             |
|-------------------- |----------|--------------------------------- |-------------------|-------------------------------------------------------------------------|
| `className`         | Optional | `string`                         | -                 | Class name to customize the look and feel of the button element itself  |
| `label`             | Optional | `string`                         | 'Delete'          | label or translation message to use                                     |
| `icon`              | Optional | `ReactElement`                   | `<DeleteIcon>`    | iconElement, e.g. `<CommentIcon />`                                     |
| `mutationMode`      | Optional | `string`                         | `'undoable'`      | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)         |
| `mutation Options`  | Optional |                                  | null              | options for react-query `useMutation` hook                              |
| `record`            | Optional | `Object`                         | -                 | Record to delete, e.g. `{ id: 12, foo: 'bar' }`                         |
| `redirect`          | Optional | `string | false | Function`      | 'list'            | Custom redirection after success side effect                            |
| `resource`          | Optional | `string`                         | -                 | Resource to delete, e.g. 'posts'                                        |
| `sx`                | Optional | `SxProps`                        | -                 | The custom styling for the button                                       |
| `success Message`   | Optional | `string`                         | 'Element deleted' | Lets you customize the success notification message.                    |

### `label`

By default, the label is `Delete` in English. In other languages, it's the translation of the `'ra.action.delete'` key.

To customize the `<DeleteButton>` label, you can either change the translation in your i18nProvider, or pass a `label` prop:

```jsx
<DeleteButton label="Delete this comment" />
```

Custom labels are automatically translated, so you can use a translation key, too:

```jsx
<DeleteButton label="resources.comments.actions.delete" />
```

### `icon`

Customize the icon of the button by passing an `icon` prop:

```jsx
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

<DeleteButton icon={<DeleteForeverIcon />} />
```

### `mutationMode`

`<DeleteButton>` has three modes, depending on the `mutationMode` prop:

- `'undoable'` (default): Clicking the button will update the UI optimistically and display a confirmation snackbar with an undo button. If the user clicks the undo button, the record will not be deleted and the UI will be rolled back. Otherwise, the record will be deleted after 5 seconds.
- `optimistic`: Clicking the button will update the UI optimistically and delete the record. If the deletion fails, the UI will be rolled back.
- `pessimistic`: Clicking the button will display a confirmation dialog. If the user confirms, the record will be deleted. If the user cancels, nothing will happen.

**Note**: When choosing the `pessimistic` mode, `<DeleteButton>` will actually render a `<DeleteWithConfirmButton>` component and accept additional props to customize the confirm dialog (see below).

### `mutationOptions`

`<DeleteButton>` calls the `useMutation` hook internally to delete the record. You can pass options to this hook using the `mutationOptions` prop.

{% raw %}
```jsx
<DeleteButton mutationOptions={{ onError: () => alert('Record not deleted, please retry') }} />
```
{% endraw %}

Check out the [useMutation documentation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) for more information on the available options.

### `record`

By default, `<DeleteButton>` reads the current record from the `RecordContext`. If you want to delete a different record, you can pass it as a prop:

{% raw %}
```jsx
<DeleteButton record={{ id: 123, author: 'John Doe' }} />
```
{% endraw %}

### `redirect`

By default, `<DeleteButton>` redirects to the list page after a successful deletion. You can customize the redirection by passing a path as the `redirect` prop:

```jsx
<DeleteButton redirect="/comments" />
```

### `resource`

By default, `<DeleteButton>` reads the current resource from the `ResourceContext`. If you want to delete a record from a different resource, you can pass it as a prop:

{% raw %}
```jsx
<DeleteButton record={{ id: 123, author: 'John Doe' }} resource="comments" />
```
{% endraw %}

### `successMessage`

![Delete button success message](./img/DeleteButton_success.png)

On success, `<DeleteButton>` displays a "Element deleted" notification in English. `<DeleteButton>` uses two successive translation keys to build the success message:

- `resources.{resource}.notifications.deleted` as a first choice
- `ra.notification.deleted` as a fallback

To customize the notification message, you can set custom translation for these keys in your i18nProvider.

**Tip**: If you choose to use a custom translation, be aware that react-admin uses the same translation message for the `<BulkDeleteButton>`, so the message must support [pluralization](./TranslationTranslating.md#interpolation-pluralization-and-default-translation):

```jsx
const englishMessages = {
    resources: {
        comments: {
            notifications: {
                deleted: 'Comment deleted |||| %{smart_count} comments deleted',
                // ...
            },
        },
    },
};
```

Alternately, pass a `successMessage` prop:

```jsx
<DeleteButton successMessage="Comment deleted successfully" />
```

### Access Control

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<DeleteButton>` will only render if the user has the "delete" access to the related resource.

`<DeleteButton>` will call `authProvider.canAccess()` using the following parameters:

```txt
{ action: "delete", resource: [current resource], record: [current record] }
```

## `<DeleteWithConfirmButton>`

Delete the current record after a confirm dialog has been accepted. To be used inside a `<Toolbar/>` component.

| Prop               | Required | Type                                             | Default                     | Description                                                             |
|------------------- |----------|--------------------------------------------------|-----------------------------|-------------------------------------------------------------------------|
| `className`        | Optional | `string`                                         | -                           | Class name to customize the look and feel of the button element itself  |
| `label`            | Optional | `string`                                         | 'ra.action.delete'          | label or translation message to use                                     |
| `icon`             | Optional | `ReactElement`                                   | `<DeleteIcon>`              | iconElement, e.g. `<CommentIcon />`                                     |
| `confirmTitle`     | Optional | `ReactNode`                                      | 'ra.message.delete_title'   | Title of the confirm dialog                                             |
| `confirmContent`   | Optional | `ReactNode`                                      | 'ra.message.delete_content' | Message or React component to be used as the body of the confirm dialog |
| `confirmColor`     | Optional | <code>'primary' &#124; 'warning'</code>          | 'primary'                   | The color of the confirm dialog's "Confirm" button                      |
| `redirect`         | Optional | <code>string &#124; false &#124; Function</code> | 'list'                      | Custom redirection after success side effect                            |
| `translateOptions` | Optional | `{ id?: string, name?: string }`                 | {}                          | Custom id and name to be used in the confirm dialog's title             |
| `mutationOptions`  | Optional |                                                  | null                        | options for react-query `useMutation` hook                              |
| `successMessage`   | Optional | `string`                                         | 'ra.notification.deleted'   | Lets you customize the success notification message.                                                                                 |

{% raw %}
```jsx
import * as React from 'react';
import { DeleteWithConfirmButton, Toolbar, Edit, SaveButton,useRecordContext } from 'react-admin';

const EditToolbar = () => {
    const record = useRecordContext();

    <Toolbar>
        <SaveButton/>
        <DeleteWithConfirmButton
            confirmContent="You will not be able to recover this record. Are you sure?"
            confirmColor="warning"
            translateOptions={{ name: record.name }}
        />
    </Toolbar>
};

const MyEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            ...
        </SimpleForm>        
    </Edit>    
);
```
{% endraw %}

## `<EditButton>`

Opens the Edit view of the current record. 

![Edit button](./img/edit-button.png)

### Usage

`<EditButton>` reads the current record from `RecordContext`, and the current resource from `ResourceContext`, so in general it doesn't need any props:

```jsx
import { EditButton, TopToolbar } from 'react-admin';

const ShowActions = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

const CommentShow = () => (
    <Show actions={<ShowActions />}>
        {/* ... */}
    </Show>
);
```

`<EditButton>` is based on react-admin's base `<Button>`, so it's responsive, accessible, and the label is translatable.

### Props

| Prop          | Required | Type            | Default          | Description                                      |
| ------------- | -------- | --------------- | ---------------- | ------------------------------------------------ |
| `resource`    | Optional | `string`        | -                | Resource to link to, e.g. 'posts'                |
| `record`      | Optional | `Object`        | -                | Record to link to, e.g. `{ id: 12, foo: 'bar' }` |
| `label`       | Optional | `string`        | 'ra.action.edit' | Label or translation message to use              |
| `icon`        | Optional | `ReactElement`  | -                | Icon element, e.g. `<CommentIcon />`             |
| `scrollToTop` | Optional | `boolean`       | `true`           | Scroll to top after link                         |

It also supports [all the other `<Button>` props](#button).

**Tip**: You can use it as `<Datagrid>` child, too. However, you should use the `<Datagrid rowClick="edit">` prop instead to avoid using one column for the Edit button.

**Tip**: If you want to link to the Edit view manually, use the `/{resource}/{record.id}` location.

**Tip:** To allow users to edit a record without leaving the current view, use the [`<EditInDialogButton>`](./EditInDialogButton.md) component.

### Access Control

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<EditButton>` will only render if the user has the "edit" access to the related resource.

`<EditButton>` will call `authProvider.canAccess()` using the following parameters:

```txt
{ action: "edit", resource: [current resource], record: [current record] }
```

## `<ExportButton>`

Exports the current list, with filters applied, but without pagination.

![Export button](./img/export-button.png)

It relies on [the `exporter` function](./List.md#exporter) passed to the `<List>` component, via the `ListContext`. It's disabled for empty lists.

### Usage

By default, the `<ExportButton>` is included in the List actions.

You can add it to a custom actions toolbar:

```jsx
import { CreateButton, ExportButton, TopToolbar } from 'react-admin';

const PostListActions = () => (
    <TopToolbar>
        <PostFilter context="button" />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

export const PostList = () => (
    <List actions={<PostListActions />}>
        ...
    </List>
);
```

### Props

| Prop         | Required | Type            | Default            | Description                         |
| ------------ | -------- | --------------- | ------------------ | ----------------------------------- |
| `maxResults` | Optional | `number`        | 1000               | Maximum number of records to export |
| `label`      | Optional | `string`        | 'ra.action.export' | label or translation message to use |
| `icon`       | Optional | `ReactElement`  | `<DownloadIcon>`   | iconElement, e.g. `<CommentIcon />` |
| `exporter`   | Optional | `Function`      | -                  | Override the List exporter function |
| `meta`       | Optional | `any`           | undefined          | Metadata passed to the dataProvider |

**Tip**: If you are looking for an `<ImportButton>`, check out this third-party package: [benwinding/react-admin-import-csv](https://github.com/benwinding/react-admin-import-csv).

## `<FilterButton>`

This button is an internal component used by react-admin in [the Filter button/form combo](./FilteringTutorial.md#the-filter-buttonform-combo).

<video controls autoplay playsinline muted loop>
  <source src="./img/list_filter.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### `sx`: CSS API

To override the style of all instances of `<FilterButton>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaFilterButton` key.

## `<ListButton>`

Opens the List view of a given resource.

![List button](./img/list-button.png)

`<ListButton>` is based on react-admin's base `<Button>`, so it's responsive, accessible, and the label is translatable.

### Usage

By default, react-admin doesn't display a `<ListButton>` in Edit and Show views action toolbar. This saves visual clutter, and users can always use the back button.

You can add it by specifying your own `actions`:

```jsx
// linking back to the list from the Show view
import { TopToolbar, ListButton, Show } from 'react-admin';

const PostShowActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

export const PostShow = () => (
    <Show actions={<PostShowActions />}>
        ...
    </Show>
);
```

**Tip**: If you want to link to the List view manually, use the `/{resource}` location.

### Props

| Prop       | Required | Type            | Default          | Description                                  |
| ---------- | -------- | --------------- | ---------------- | -------------------------------------------- |
| `resource` | Optional | `string`        | -                | target resource, e.g. 'posts'                |
| `label`    | Optional | `string`        | 'ra.action.list' | label or translation message to use          |
| `icon`     | Optional | `ReactElement`  | -                | iconElement, e.g. `<CommentIcon />`          |

It also supports [all the other `<Button>` props](#button).

### Access Control

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ListButton>` will only render if the user has the "list" access to the related resource.

`<ListButton>` will call `authProvider.canAccess()` using the following parameters:

```txt
{ action: "list", resource: [current resource] }
```

## `<RefreshButton>`

## `<SkipNavigationButton>`

### `sx`: CSS API

| Rule name                                     | Description                                     |
|-----------------------------------------------|-------------------------------------------------|
| `&.RaSkipNavigationButton-skipToContentButton` | Applied to the underlying `MuiButton` component |

To override the style of all instances of `<SkipNavigationButton>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaSkipNavigationButton` key.

## `<ShowButton>`

Opens the Show view of the current record:

![Show button](./img/show-button.png)

### Usage

`<ShowButton>` reads the current record from `RecordContext`, and the current resource from `ResourceContext`, so in general it doesn't need any props:

```jsx
import { ShowButton, TopToolbar, Edit } from 'react-admin';

const EditActions = () => (
    <TopToolbar>
        <ShowButton />
    </TopToolbar>
);

const CommentEdit = () => (
    <Edit actions={<EditActions />}>
        {/* ... */}
    </Edit>
);
```

`<ShowButton>` is based on react-admin's base `<Button>`, so it's responsive, accessible, and the label is translatable.

### Props

| Prop          | Required | Type            | Default          | Description                                      |
| ------------- | -------- | --------------- | ---------------- | ------------------------------------------------ |
| `resource`    | Optional | `string`        | -                | The target resource, e.g. 'posts'                |
| `record`      | Optional | `Object`        | -                | Record to link to, e.g. `{ id: 12, foo: 'bar' }` |
| `component`   | Optional | `ReactElement`  | -                | Base path to resource, e.g. '/posts'             |
| `label`       | Optional | `string`        | 'ra.action.show' | Label or translation message to use              |
| `icon`        | Optional | `ReactElement`  | -                | Icon element, e.g. `<CommentIcon />`             |
| `scrollToTop` | Optional | `boolean`       | `true`           | Scroll to top after link                         |

It also supports [all the other `<Button>` props](#button).

**Tip**: You can use it as `<Datagrid>` child with no props too. However, you should use the `<Datagrid rowClick="show">` prop instead to avoid using one column for the Edit button.

**Tip**: If you want to link to the Show view manually, use the `/{resource}/{record.id}/show` location.

### Access Control

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ShowButton>` will only render if the user has the "show" access to the related resource.

`<ShowButton>` will call `authProvider.canAccess()` using the following parameters:

```txt
{ action: "show", resource: [current resource], record: [current record] }
```

## `<UpdateButton>`

This component allows to create a button that updates a record by calling the [`useUpdate hook`](./useUpdate.md).

<video controls playsinline muted loop poster="./img/updatebutton.png" >
  <source src="./img/updatebutton.webm" type="video/webm" />
  <source src="./img/updatebutton.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

### Usage

Use `<UpdateButton>` inside the actions toolbar of the [`Edit`](./Edit.md#actions) or [`Show`](./Show.md#actions) views.

{% raw %}
```jsx
import { Edit, SimpleForm, TextInput, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} />
    </TopToolbar>
);

export const PostEdit = () => (
    <Edit actions={<PostEditActions />}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

### Props

`<UpdateButton>` accepts the following props:

| Prop             | Required | Type        | Default    | Description                                              |
| ---------------- | -------- | ----------- | ---------- | -------------------------------------------------------- |
| `data`           | Required | `object`    |            | The data used to update the record                       |
| `mutationMode`   | Optional | `string`    | `undoable` | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`) |
| `confirmTitle`   | Optional | `ReactNode` | `ra.message.bulk_update_title` | The title of the confirmation dialog when `mutationMode` is not `undoable` |
| `confirmContent` | Optional | `ReactNode` | `ra.message.bulk_update_content` | The content of the confirmation dialog when `mutationMode` is not `undoable` |
| `mutationOptions` | Optional | `Object`  |        | The react-query mutation options |

`<UpdateButton>` also accepts the [Button props](./Buttons.md#button).

### `data`

The data used to update the record. Passed to the `dataProvider.update` method. This prop is required.

{% raw %}
```tsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} />
    </TopToolbar>
);
```
{% endraw %}

### `mutationMode`

The mutation mode determines when the side effects (redirection, notifications, etc.) are executed:

- `pessimistic`: The mutation is passed to the dataProvider first. When the dataProvider returns successfully, the mutation is applied locally, and the side effects are executed. 
- `optimistic`: The mutation is applied locally and the side effects are executed immediately. Then the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown. 
- `undoable` (default): The mutation is applied locally and the side effects are executed immediately. Then a notification is shown with an undo button. If the user clicks on undo, the mutation is never sent to the dataProvider, and the page is refreshed. Otherwise, after a 5 seconds delay, the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.

By default, the `<UpdateButton>` uses the `undoable` mutation mode. This is part of the "optimistic rendering" strategy of react-admin ; it makes user interactions more reactive. 

You can change this default by setting the `mutationMode` prop. For instance, to remove the ability to undo the changes, use the `optimistic` mode:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} mutationMode="optimistic" />
    </TopToolbar>
);
```
{% endraw %}

And to make the action blocking, and wait for the dataProvider response to continue, use the `pessimistic` mode:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} mutationMode="pessimistic" />
    </TopToolbar>
);
```
{% endraw %}


**Tip**: When using any other mode than `undoable`, the `<UpdateButton>` displays a confirmation dialog before calling the dataProvider. 

### `confirmTitle`

Only used when `mutationMode` is either `optimistic` or `pessimistic` to change the confirmation dialog title:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton
            label="Reset views"
            data={{ views: 0 }}
            mutationMode="optimistic"
            confirmTitle="Reset views"
        />
    </TopToolbar>
);
```
{% endraw %}

### `confirmContent`

Only used when `mutationMode` is either `optimistic` or `pessimistic` to change the confirmation dialog content:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton
            label="Reset views"
            data={{ views: 0 }}
            mutationMode="optimistic"
            confirmContent="Do you really want to reset the views?"
        />
    </TopToolbar>
);
```
{% endraw %}

### `mutationOptions`

`<UpdateButton>` calls `dataProvider.update()` via react-query's `useMutation` hook. You can customize the options you pass to this hook, e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.update()` call.

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton
            label="Reset views"
            data={{ views: 0 }}
            mutationOptions={{ meta: { foo: 'bar' } }}
        />
    </TopToolbar>
);
```
{% endraw %}

You can also use `mutationOptions` to override success or error side effects, by setting the `mutationOptions` prop. Refer to the [useMutation documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation) in the react-query website for a list of the possible options.

Let's see an example with the success side effect. By default, when the action succeeds, react-admin shows a notification, and refreshes the view. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify(`Changes saved`);
        redirect('/posts');
    };

    return (
        <TopToolbar>
            <UpdateButton
                label="Reset views"
                data={{ views: 0 }}
                mutationOptions={{ onSuccess }}
            />
        </TopToolbar>
    );
}
```
{% endraw %}

The default `onSuccess` function is:

```js
() => {
    notify('ra.notification.updated', {
        messageArgs: { smart_count: 1 },
        undoable: mutationMode === 'undoable'
    });
}
```

**Tip**: When you use `mutationMode="pessimistic"`, the `onSuccess` function receives the response from the `dataProvider.update()` call, which is the edited record (see [the dataProvider documentation for details](./DataProviderWriting.md#update)). You can use that response in the success side effects: 

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes to post "${data.title}" saved`);
        redirect('/posts');
    };

    return (
        <TopToolbar>
            <UpdateButton
                label="Reset views"
                data={{ views: 0 }}
                mutationOptions={{ onSuccess }}
            />
        </TopToolbar>
    );
}
```
{% endraw %}

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows a notification error.

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not edit post: ${error.message}`);
        redirect('/posts');
        refresh();
    };

    return (
        <TopToolbar>
            <UpdateButton
                label="Reset views"
                data={{ views: 0 }}
                mutationOptions={{ onError }}
            />
        </TopToolbar>
    );
}
```
{% endraw %}

The `onError` function receives the error from the `dataProvider.update()` call. It is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', { type: 'error' });
}
```

### `sx`

The sx prop lets you style the component and its children using Material-ui's [sx syntax](https://mui.com/system/the-sx-prop/).

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} sx={{ width: 500 }} />
    </TopToolbar>
);
```
{% endraw %}

## `<UserMenu>`

| Prop         | Required | Type            | Default             | Description                         |
| ------------ | -------- | --------------- | ------------------- | ----------------------------------- |
| `children`   | Optional | `ReactElement`  | -                   | elements to use as menu items       |
| `label`      | Required | `string`        | 'ra.auth.user_menu' | label or translation message to use |
| `icon`       | Optional | `ReactElement`  | `<AccountCircle>`   | iconElement, e.g. `<CommentIcon />` |

### `sx`: CSS API

| Rule name                  | Description                                                                                                                              |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `& .RaUserMenu-userButton` | Applied to the underlying `MuiButton` component when `useGetIdentity().loaded` is `true` and `useGetIdentity().identity.fullName` is set |
| `& .RaUserMenu-avatar`     | Applied to the underlying `MuiAvatar` component when `useGetIdentity().avatar` is `true`                                                 |

To override the style of all instances of `<UserMenu>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaUserMenu` key.

See [The AppBar documentation](./AppBar.md#usermenu) for more details.

## Performance

The ripple effect can cause [performance issues](https://github.com/marmelab/react-admin/issues/5587) when displaying a large number of buttons (e.g. in a large datagrid). It's possible to remove the ripple effect from within your Material UI theme. The [Material UI docs](https://mui.com/material-ui/getting-started/faq/#how-can-i-disable-the-ripple-effect-globally) provide instructions on how to do this.

It's worth noting that removing the ripple will cause accessibility issues, including a lack of focus states during tab navigating for components like `BooleanInput` and `CheckboxGroupInput`.

Note: The `disableRipple` was set to `true` in React Admin for a time, but was reimplemented due to accessibility concerns. If you'd like to reimplement the static ripple color effect, you can use [React Admin's previous implementation](https://github.com/marmelab/react-admin/blob/994079cbca810a2e74d85329e684811645b04ae2/packages/ra-ui-materialui/src/defaultTheme.ts#L31) as a starting point. [The Material UI docs](https://mui.com/material-ui/api/button-base/#props) also gives details on how to reimplement focus styles using the `Mui-focusVisible` class.
