---
layout: default
title: "The CloneButton Component"
---

# `<CloneButton>`

Users may need to create a copy of an existing record. For that use case, use the `<CloneButton>` component. It reads the `record` from the current `RecordContext`.

For instance, to allow cloning all the posts from the list:

```jsx
import * as React from "react";
import { List, Datagrid, TextField, CloneButton } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="title" />
            <CloneButton />
        </Datagrid>
    </List>
);
```

**Note**: `<CloneButton>` is designed to be used in a `<Datagrid>` and in an edit view `<Actions>` component, not inside the form [`<Toolbar>`](./Toolbar.md). The `Toolbar` is basically for submitting the form, not for going to another resource.

