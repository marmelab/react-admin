---
layout: default
title: "The WrapperField Component"
---

# `<WrapperField>`

This component simply renders its children. Why would you want to use such a dumb component? To combine several fields in a single cell (in a `<Datagrid>`) or in a single row (in a `<SimpleShowLayout>`). 

`<WrapperField>` allows to define the `label` and sort field for a combination of fields:

```jsx
import { List, Datagrid, WrapperField, TextField } from 'react-admin';

const BookList = () => (
   <List>
       <Datagrid>
            <TextField source="title" />
            <WrapperField label="author" sortBy="author.last_name">
                <TextField source="author_first_name" />
                <TextField source="author_last_name" />
            </WrapperField>
      </Datagrid>
  </List>
);
```

**Tip**: If you just want to combine two fields in a string, check  [the `<FunctionField>` component](./FunctionField.md) instead.