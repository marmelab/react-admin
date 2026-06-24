---
layout: default
title: "The ListButton Component"
---

# `<ListButton>`

A common customization of Create and Edit views is to add a button to go back to the List. Use the `<ListButton>` for that:

```jsx
import { TopToolbar, ListButton, ShowButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <ListButton />
        <ShowButton />
    </TopToolbar>
);

const PostEdit = () => (
    <Edit actions={<PostEditActions />}>
        ...
    </Edit>
);
```

If you want this button to look like a Back button, you can pass a custom label and icon:

```jsx
import ChevronLeft from '@mui/icons-material/ChevronLeft';

const PostEditActions = () => (
    <TopToolbar>
        <ListButton label="Back" icon={<ChevronLeft />} />
        <ShowButton />
    </TopToolbar>
);
```