---
layout: default
title: "The SearchInput Component"
---

# `<SearchInput>`

In addition to [the usual input types](./Inputs.md) (`<TextInput>`, `<SelectInput>`, `<ReferenceInput>`, etc.), you can use the `<SearchInput>` in the [`filters` array](./List.md#filters-filter-inputs). This input is designed especially for the [Filter Form](./FilterForm.md). It's like a `<TextInput resettable>` with a magnifier glass icon - exactly the type of input users look for when they want to do a full-text search.

<video controls autoplay playsinline muted loop>
  <source src="./img/search_input.webm" type="video/webm"/>
  <source src="./img/search_input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

**Tip:** Prefer using [`<FilterLiveSearch>`](./FilterLiveSearch.md) component if you want to provide your users with a search feature in a [`<List>` aside](./List.md#aside).

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-live-search.webm" type="video/webm"/>
  <source src="./img/filter-live-search.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

```tsx
import { SearchInput, TextInput, SelectInput } from 'react-admin';

const postFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
    <SelectInput source="category" choices={choices} />,
];

export const PostList = () => (
    <List filters={postFilters}>
        ...
    </List>
);
```

In the example given above, the `q` filter triggers a full-text search on all fields. It's your responsibility to implement the full-text filtering capabilities in your `dataProvider`, or in your API.

## Props

| Prop         | Required | Type      | Default | Description                                                          |
| ------------ | -------- | --------- | ------- | -------------------------------------------------------------------- |
| `placeholder`       | Optional | `string`  | `Search`  | Attribute for displaying default text in the `input` element |
| `resettable`       | Optional | `boolean`  | `true`  | If `true`, displays a clear button next to the input                        |

`<SearchInput>` also accepts the [common input props](./Inputs.md#common-input-props).

Additional props are passed down to the underlying Material UI [`<TextField>`](https://mui.com/material-ui/react-text-field/) component.

## `placeholder`

Replace the default `Search` placeholder by setting the placeholder prop:

```jsx
<SearchInput source="q" placeholder="My search" alwaysOn />
```

## `resettable`

You can disable the input reset feature by setting `resettable` to `false`:

```tsx
<SearchInput source="q" resettable={false} alwaysOn />
```
