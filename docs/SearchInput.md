---
layout: default
title: "The SearchInput Component"
---

# `<SearchInput>`

In addition to [the usual input types](./Inputs.md) (`<TextInput>`, `<SelectInput>`, `<ReferenceInput>`, etc.), you can use the `<SearchInput>` in the `filters` array. This input is designed especially for the [`Filter Form`](./FilterForm.md). It's like a `<TextInput resettable>` with a magnifier glass icon - exactly the type of input users look for when they want to do a full-text search.

<video controls autoplay playsinline muted loop>
  <source src="./img/search_input.webm" type="video/webm"/>
  <source src="./img/search_input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Is an `<Aside>` component, we invite you to use `<FilterLiveSearch>` component to search your data as you can find in [the component chapter](./FilterLiveSearch.md)

<video controls autoplay playsinline muted loop>
  <source src="./img/filter-live-search.webm" type="video/webm"/>
  <source src="./img/filter-live-search.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

```jsx
import { SearchInput, TextInput } from 'react-admin';

const postFilters = [
    <SearchInput source="q" alwaysOn />
];
```

In the example given above, the `q` filter triggers a full-text search on all fields. It's your responsibility to implement the full-text filtering capabilities in your `dataProvider`, or in your API.

## Props

| Prop         | Required | Type      | Default | Description                                                          |
| ------------ | -------- | --------- | ------- | -------------------------------------------------------------------- |
| `placeholder`       | Optional | `string`  | `Search`  | Attribute for displaying default text in the `input` element |
| `resettable`       | Optional | `boolean`  | `true`  | If `tue`, a delete button appear on input writing                       |
| `variant`       | Optional | `string`  | `filled`  | Type attribute passed to the `<input>` element. Could be `filled` or `standard` too                       |

`<SearchInput>` also accepts the [common input props](./Inputs.md#common-input-props).

Additional props are passed down to the underlying Material UI [`<TextField>`](https://mui.com/material-ui/react-text-field/) component.

## `placeholder`

The placeholder is an attribute used to display text by default in certain form fields. Here you can write your string instead of `Search`.

```jsx
<SearchInput source="q" placeholder="My search" alwaysOn />
```

## `resettable`

You can disable reset function

```jsx
<SearchInput source="q" resettable={false} alwaysOn />
```

<video controls autoplay playsinline muted loop>
  <source src="./img/resettable.webm" type="video/webm"/>
  Your browser does not support the video tag.
</video>

## `variant`

You could change the component display with the 3 variant type :

- `filled` (set as default)
- `outlined`
- `standard`

![Variant options](./img/variant.png)
