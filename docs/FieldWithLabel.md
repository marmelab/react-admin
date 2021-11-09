---
layout: default
title: "FieldWithLabel"
---

# `<FieldWithLabel>`

`<FieldWithLabel>` adds a label on top of its child if the child exposes a `label` prop, or if it's a field with a `source` prop. It's used in Show layouts, to display both a field and its label. 

## Usage

`<FieldWithLabel>` is mostly an internal component - you don't need it if you're using `<SimpleShowLayout>` or `<TabbedshowLayout>`. But, in a custom layout, if you want to display a label on top of a field value, just wrap the Field component with `<FieldWithLabel>`. 

```jsx
import { Show, FieldWithLabel, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';

const BookShow = () => (
   <Show>
      <Card>
         <Stack>
            <FieldWithLabel>
               <TextField source="title" />
            </FieldWithLabel>
         </Stack>
     </Car>
  </Show>
);
```

## Label

`<FieldWithLabel>` uses the humanized `source`, and renders it above the field value. So for the previous example, the label would be `"Title"`. 

`<FieldWithLabel>` uses the i18n layer, so you can translate the label. The message key for a label is `resources.{resource}.fields.{source}` (e.g. `resources.books.fields.title` for the element above). Check [the Translation chapter](./Translation.md) for more information.

`<FieldWithLabel>` can also use an explicit `label` prop: 

```jsx
import { Show, FieldWithLabel, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';

const BookShow = () => (
   <Show>
      <Card>
         <Stack>
            <FieldWithLabel label="My custom label">
               <TextField source="title" />
            </FieldWithLabel>
         </Stack>
     </Car>
  </Show>
);
```

A component inside `<FieldWithLabel>` can opt out of label decoration by using the `label={false}` prop.

```jsx
import { Show, FieldWithLabel, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';

const BookShow = () => (
   <Show>
      <Card>
         <Stack>
            <FieldWithLabel>
               <TextField source="title" label={false} />
            </FieldWithLabel>
         </Stack>
     </Car>
  </Show>
);
```

## API

* [`FieldWithLabel`]

[`FieldWithLabel`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/FieldWithLabel.tsx