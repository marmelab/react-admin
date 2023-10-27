---
layout: default
title: "The SearchInput Component"
---

# `<SearchInput>`

<video controls autoplay playsinline muted loop>
  <source src="./img/search_input.webm" type="video/webm"/>
  <source src="./img/search_input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


In addition to [the usual input types](./Inputs.md) (`<TextInput>`, `<SelectInput>`, `<ReferenceInput>`, etc.), you can use the `<SearchInput>` in the `filters` array. This input is designed especially for the [`Filter Form`](./FilterForm.md). It's like a `<TextInput resettable>` with a magnifier glass icon - exactly the type of input users look for when they want to do a full-text search.

```jsx
import { SearchInput, TextInput } from 'react-admin';

const postFilters = [
    <SearchInput source="q" alwaysOn />
];
```

In the example given above, the `q` filter triggers a full-text search on all fields. It's your responsibility to implement the full-text filtering capabilities in your `dataProvider`, or in your API.
