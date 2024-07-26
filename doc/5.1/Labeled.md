---
layout: default
title: "Labeled"
---

# `<Labeled>`

`<Labeled>` adds a label on top of its child. It uses the child `label` or `source` prop for the label. Use it in Edit and Show views to decorate [Field components](./Fields.md) with a label.

![Labeled](./img/Labeled.png)

<iframe src="https://www.youtube-nocookie.com/embed/fWc7c0URQMQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

`<SimpleShowLayout>` and `<TabbedShowLayout>` already decorate their children with `<Labeled>`. So you don't need to use it in most cases.

In a custom Show layout, or in a form, if you want to display a field value with a label, just wrap the Field component with `<Labeled>`.

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

## Props

| Prop         | Required | Type             | Default   | Description |
|:-------------|:---------|:-----------------|:----------|:------------|
| `children`   | Required | Element          |           | The wrapped component |
| `className`  | Optional | string           |           | The class name |
| `color`      | Optional | string           | `text.secondary` | The color of the label |
| `fullWidth`  | Optional | boolean          | `false`   | Whether to stretch the label to the full width of the container |
| `isRequired` | Optional | boolean          | `false`   | Whether to display an asterisk. |
| `label`      | Optional | string           |           | The label. If not set, the label is inferred from the child component |
| `sx`         | Optional | [SxProps](https://mui.com/system/the-sx-prop/) |           | Custom styles |

Additional props are passed to the underlying [Material UI `<Stack>` element](https://mui.com/material-ui/react-stack/).

## `children`

`<Labeled>` usually wraps a [Field component](./Fields.md).

```jsx
<Labeled>
   <TextField source="title" />
</Labeled>
```

But it can wrap any component, as long as you provide [a `label` prop](#label).

```jsx
<Labeled label="My custom label">
   <Username />
</Labeled>
```

## `color`

Color of the label. Defaults to `text.secondary`. You can use a hex color string, as well as any color value from the theme:

- `primary.main`
- `secondary.main`
- `error.main`
- `warning.main`
- `info.main`
- `success.main`
- `text.primary`
- `text.secondary`
- `text.disabled`

```jsx
<Labeled color="success.main">
   <TextField source="title" />
</Labeled>
```

## `fullWidth`

By default, the label is only as wide as the child component. If you want the label to stretch to the full width of the container, set the `fullWidth` prop to `true`.

```jsx
<Labeled fullWidth>
   <TextField source="title" />
</Labeled>
```

## `isRequired`

If you want to append an asterisk to the label to indicate that the field is required, set the `isRequired` prop to `true`.

```jsx
<Labeled isRequired>
   <TextField source="title" />
</Labeled>
```

## `label`

`<Labeled>` uses the humanized `source` prop of its child as the label. So for the following example, the label would be `"Title"`.

```jsx
<Labeled>
   <TextField source="title" />
</Labeled>
```

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

## `sx`: CSS API

The `<Labeled>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                 | Description                                             |
|---------------------------|---------------------------------------------------------|
| `&.RaLabeled-fullWidth`   | Applied to the root component                           |
| `& .RaLabeled-label`      | Applied to the underlying Material UI's `Typography` component  |


To override the style of all instances of `<Labeled>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaLabeled` key.
