---
layout: default
title: "Labeled"
---

# `<Labeled>`

`<Labeled>` adds a label on top of its child if the child exposes a `label` prop, or if it's a field with a `source` prop. It's used in Show layouts, to display both a field and its label. 

## Usage

`<Labeled>` is mostly an internal component - you don't need it if you're using `<SimpleShowLayout>` or `<TabbedShowLayout>`. But, in a custom layout or in a form, if you want to display a label on top of a field value, just wrap the Field component with `<Labeled>`. 

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
     </Card>
  </Show>
);
```

## Label

`<Labeled>` uses the humanized `source`, and renders it above the field value. So for the previous example, the label would be `"Title"`. 

`<Labeled>` uses the i18n layer, so you can translate the label. The message key for a label is `resources.{resource}.fields.{source}` (e.g. `resources.books.fields.title` for the element above). Check [the Translation chapter](./TranslationTranslating.md) for more information.

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
     </Card>
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
     </Card>
  </Show>
);
```

## API

* [`Labeled`]

[`Labeled`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/Labeled.tsx

## `sx`: CSS API

The `<Labeled>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                 | Description                                             |
|---------------------------|---------------------------------------------------------|
| `&.RaLabeled-fullWidth`   | Applied to the root component                           |
| `& .RaLabeled-label`      | Applied to the underlying Material UI's `Typography` component  |


To override the style of all instances of `<Labeled>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaLabeled` key.
