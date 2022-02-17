---
layout: default
title: "Labeled"
---

# `<Labeled>`

`<Labeled>` adds a label on top of its child if the child exposes a `label` prop, or if it's a field with a `source` prop. It's used in Show layouts, to display both a field and its label. 

## Usage

`<Labeled>` is mostly an internal component - you don't need it if you're using `<SimpleShowLayout>` or `<TabbedshowLayout>`. But, in a custom layout or in a form, if you want to display a label on top of a field value, just wrap the Field component with `<Labeled>`. 

```jsx
import { Show, Labeled, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';

const BookShow = () => (
   <Show>
      <Card>
         <Stack>
            <Labeled>
               <TextField source="title" />
            </Labeled>
         </Stack>
     </Car>
  </Show>
);
```

## Label

`<Labeled>` uses the humanized `source`, and renders it above the field value. So for the previous example, the label would be `"Title"`. 

`<Labeled>` uses the i18n layer, so you can translate the label. The message key for a label is `resources.{resource}.fields.{source}` (e.g. `resources.books.fields.title` for the element above). Check [the Translation chapter](./Translation.md) for more information.

`<Labeled>` can also use an explicit `label` prop: 

```jsx
import { Show, Labeled, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';

const BookShow = () => (
   <Show>
      <Card>
         <Stack>
            <Labeled label="My custom label">
               <TextField source="title" />
            </Labeled>
         </Stack>
     </Car>
  </Show>
);
```

A component inside `<Labeled>` can opt out of label decoration by using the `label={false}` prop.

```jsx
import { Show, Labeled, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';

const BookShow = () => (
   <Show>
      <Card>
         <Stack>
            <Labeled>
               <TextField source="title" label={false} />
            </Labeled>
         </Stack>
     </Car>
  </Show>
);
```

## API

* [`Labeled`]

[`Labeled`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/Labeled.tsx
