---
layout: default
title: "The RevisionsButton Component"
---

# `<RevisionsButton>`

This button opens a menu with the list of revisions of the current record. When users select a revision, it opens a diff view, allowing them to see the changes between the current version and the selected revision. The user can then revert to the selected revision by clicking on the "Revert" button.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/RevisionsButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

`<RevisionsButton>` is an [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component, part of [`ra-history`](https://react-admin-ee.marmelab.com/documentation/ra-history).

## Usage

First, install the `@react-admin/ra-history` package:

```sh
npm install --save @react-admin/ra-history
# or
yarn add @react-admin/ra-history
```

Tip: `ra-history` is hosted in a private npm registry. You need to subscribe to one of the [Enterprise Edition](https://react-admin-ee.marmelab.com/) plans to access this package.

`<RevisionsButton>` is usually used in the page `actions` of an `<Edit>` component, in conjunction with [`<SimpleFormWithRevision>`](./SimpleForm.md#versioning).

```tsx
import { Edit, SelectInput, TextInput, TopToolbar } from 'react-admin';
import {
    SimpleFormWithRevision,
    RevisionsButton,
} from '@react-admin/ra-history';
import categories from './categories';

const ProductEditActions = () => (
    <TopToolbar>
        <RevisionsButton />
    </TopToolbar>
);

export const ProductEdit = () => (
    <Edit actions={<ProductEditActions />}>
        <SimpleFormWithRevision>
            <TextInput source="reference" />
            <TextInput multiline source="description" />
            <TextInput source="image" />
            <SelectInput source="category" choices={categories} />
        </SimpleFormWithRevision>
    </Edit>
);
```

It reads the current record from the `RecordContext`, and the current resource from the `ResourceContext`. It calls `dataProvider.getRevisions()` to fetch the list of revisions of the current record.

## Props

| Prop          | Required | Type     | Default                   | Description                                                                                |
| ------------- | -------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------ |
| `allowRevert` | Optional | Boolean  | false                     | If true, users will be able to revert to a previous version of the record.                 |
| `diff`        | Optional | Element  | `<DefaultDiff Element />` | The element used to represent the diff between two versions.                               |
| `onSelect`    | Optional | Function |                           | A function to call when the user selects a revision. It receives the revision as argument. |
| `renderName`  | Optional | Function |                           | A function to render the author name based on its id                                       |

### `allowRevert`

By default, the detail view of a revision rendered in the dialog is read-only. You can include a button to revert to a previous version of the record by setting the `allowRevert` prop.

```tsx
const ProductEditActions = () => (
    <TopToolbar>
        <RevisionsButton allowRevert />
    </TopToolbar>
);
```

### `diff`

The detail view of a revision includes a diff view to compare the current version of the record with a previous version. You can customize the diff view by setting the `diff` prop to a React element.

This element can grab the current record using `useRecordContext`, and the record from the revision selected by the user using `useReferenceRecordContext`. But instead of doing the diff by hand, you can use the two field diff components provided by `ra-history`:

-   [`<FieldDiff>`](https://react-admin-ee.marmelab.com/documentation/ra-history#fielddiff) displays the diff of a given field. It accepts a react-admin Field component as child.
-   [`<SmartFieldDiff>`](https://react-admin-ee.marmelab.com/documentation/ra-history#smartfielddiff) displays the diff of a string field, and uses a word-by-word diffing algorithm to highlight the changes.

So a custom diff view is usually a layout component with `<FieldDiff>` and `<SmartFieldDiff>` components as children:

```tsx
import { Stack } from '@mui/material';
import {
    FieldDiff,
    SmartFieldDiff,
    RevisionsButton,
} from '@react-admin/ra-history';
import { Edit, NumberField } from 'react-admin';

const ProductDiff = () => (
    <Stack gap={1}>
        <FieldDiff source="reference" />
        <SmartFieldDiff source="description" />
        <SmartFieldDiff source="image" />
        <Stack direction="row" gap={2}>
            <FieldDiff inline>
                <NumberField source="width" />
            </FieldDiff>
            <FieldDiff inline>
                <NumberField source="height" />
            </FieldDiff>
        </Stack>
        <Stack direction="row" gap={2}>
            <FieldDiff inline>
                <NumberField source="price" />
            </FieldDiff>
            <FieldDiff inline>
                <NumberField source="stock" />
            </FieldDiff>
            <FieldDiff inline>
                <NumberField source="sales" />
            </FieldDiff>
        </Stack>
    </Stack>
);

const ProductEditActions = () => (
    <TopToolbar>
        <RevisionsButton diff={<ProductDiff />} />
    </TopToolbar>
);
```

## `onSelect`

If you want to do something when users select a given revision, you can use the `onSelect` prop. It receives the selected revision as argument.

```tsx
const ProductEditActions = () => (
    <TopToolbar>
        <RevisionsButton onSelect={revision => console.log(revision)} />
    </TopToolbar>
);
```

## `renderName`

Revisions keep an `authorId`, but not the name of the revision author. You can use the `renderName` prop to display the name of the author in the list of revisions based on your user data. It expects a function that accepts the `authorId` and returns a React element.

For instance, if the users are stored in a `users` resource, you can use the following:

```tsx
const UserName = ({ id }) => {
    const { data: user } = useGetOne('users', { id });
    if (!user) return null;
    return (
        <>
            {user.firstName} {user.lastName}
        </>
    );
};

const ProductEditActions = () => (
    <TopToolbar>
        <RevisionsButton renderName={id => <UserName id={id} />} />
    </TopToolbar>
);
```

## Showing the List of Revisions

By default, the `<RevisionsButton>` component only shows the list of revisions when the user clicks on the button. If you want to always show the list of revisions, you can use the [`<RevisionListWithDetailsInDialog>`](https://react-admin-ee.marmelab.com/documentation/ra-history#revisionlistwithdetailsindialog) component instead. 

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/RevisionListWithDetailsInDialog.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


This component is usually used in an `<Edit aside>`.

```tsx
import { Edit } from "react-admin";
import {
  SimpleFormWithRevision,
  RevisionListWithDetailsInDialog,
} from "@react-admin/ra-history";
import { Box, Typography } from "@mui/material";

const ProductAside = () => (
  <Box width={300} px={2}>
    <Typography variant="h6" gutterBottom>
      Revisions
    </Typography>
    <RevisionListWithDetailsInDialog allowRevert />
  </Box>
);

export const ProductEdit = () => (
  <Edit aside={<ProductAside />}>
    <SimpleFormWithRevision>{/* ... */}</SimpleFormWithRevision>
  </Edit>
);
```

Check the [`<RevisionListWithDetailsInDialog>`](https://react-admin-ee.marmelab.com/documentation/ra-history#revisionlistwithdetailsindialog) documentation for more details.
