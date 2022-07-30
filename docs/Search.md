---
layout: default
title: "The Search Component"
---

# `<Search>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component, part of [`ra-search`](https://marmelab.com/ra-enterprise/modules/ra-search), lets user do a site-wide search via a smart Omnibox.

![ra-search](https://marmelab.com/ra-enterprise/modules/assets/ra-search-demo.gif)

`<Search>` renders a global search input. It's designed to be integrated into the top `<AppBar>`.

It relies on the `dataProvider` to provide a `search()` method, so you can use it with any search engine (Lucene, ElasticSearch, Solr, Algolia, Google Cloud Search, and many others). And if you don't have a search engine, no problem! `<Search>` can also do the search across several resources via parallel `dataProvider.getList()` queries.

## Usage

Include the `<Search>` component inside a custom `<AppBar>` component:

{% raw %}
```jsx
// in src/MyAppBar.jsx
import { AppBar } from "react-admin";
import { Typography } from "@mui/material";
import { Search } from "@react-admin/ra-search";

export const MyAppbar = (props) => (
  <AppBar {...props}>
    <Typography
      variant="h6"
      color="inherit"
      sx={{
        flex: 1,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      id="react-admin-title"
    />
    <Search />
  </AppBar>
);
```
{% endraw %}

Include that AppBar in [a custom layout component](./Layout.md):

```jsx
// in src/MyLayout.jsx
import { Layout } from "react-admin";
import { MyAppbar } from "./MyAppBar";

export const MyLayout = (props) => <Layout {...props} appBar={MyAppbar} />;
```

Finally, include that custom layout in the `<Admin>`. You'll also need to setup the `i18nProvider`, as the `ra-search` package comes with some new translations.

```jsx
// in src/Admin.ts
import { Admin } from "react-admin";

import { MyLayout } from "./MyLayout";

export const App = () => (
  <Admin
    dataProvider={searchDataProvider}
    i18nProvider={i18nProvider}
    layout={MyLayout}
  >
    // ...
  </Admin>
);
```

Your `dataProvider` should support the `search()` method. Check [the `ra-search` documentation](https://marmelab.com/ra-enterprise/modules/ra-search) to learn its input and output interface, as well as tricks to use `dataProvider.search()` without a search engine.

## Props


| Prop        | Required | Type               | Default  | Description                                                        |
| ----------- | -------- | ------------------ | -------- | ------------------------------------------------------------------ |
| `children`  | Optional | `ReactNode`        | `<SearchResultsPanel>` | The search result renderer                           |
| `options`   | Optional | `object`           | -        | The search options (see details below)                             |
| `wait`      | Optional | `number`           | 500      | The delay of debounce for the search to launch after typing in ms. |
| `color`     | Optional | `'light' | 'dark'` | 'light'  | The color mode for the input, applying light or dark background.   |

The `options` object can contain the following keys:

-   `targets`: `string[]` An array of the indices on which to perform the search. Defaults to an empty array.
-   `historySize`: `number` The max number of search texts kept in the history. Default is 5.
-   `{any}`: `{any}` Any custom option to pass to the search engine.

## Customizing The Result Items

By default, `<Search>` displays the results in `<SearchResultsPanel>`, which displays each results in a `<SearchResultItem>`. So rendering `<Search>` without children is equivalent to rendering:

```jsx
const MySearch = () => (
    <Search>
        <SearchResultsPanel>
            <SearchResultItem />
        </SearchResultsPanel>
    </Search>
);
```

`<SearchResultItem>` renders the `content.label` and `content.description` for each result. You can customize what it renders by providing a function as the `label` and the `description` props. This function takes the search result as a parameter and must return a React element.

For instance:

```jsx
import {
    Search,
    SearchResultsPanel,
    SearchResultItem,
} from '@react-admin/ra-search';

const MySearch = () => (
    <Search>
        <SearchResultsPanel>
            <SearchResultItem
                label={record => (
                    <>
                        {record.type === 'artists' ? (
                            <PersonIcon />
                        ) : (
                            <MusicIcon />
                        )}
                        <span>{record.content.label}</span>
                    </>
                )}
            />
        </SearchResultsPanel>
    </Search>
);
```

You can also completely replace the search result item component:

```jsx
import { Search, SearchResultsPanel } from '@react-admin/ra-search';

const MySearchResultItem = ({ data, onClose }) => (
    <li key={data.id}>
        <Link to={data.url} onClick={onClose}>
            <strong>{data.content.label}</strong>
        </Link>
        <p>{data.content.description}</p>
    </li>
);

const MySearch = () => (
    <Search>
        <SearchResultsPanel>
            <MySearchResultItem />
        </SearchResultsPanel>
    </Search>
);
```

## Customizing the Entire Search Results

Pass a custom React element as a child of `<Search>` to customize the appearance of the search results. This can be useful e.g. to customize the results grouping, or to arrange search results differently.

`ra-search` renders the `<Search>` inside a `SearchContext`. You can use the `useSearchResultContext` hook to read the search results, as follows:

```jsx
import { Search, useSearchResult } from '@react-admin/ra-search';

const MySearch = props => (
    <Search>
        <CustomSearchResultsPanel />
    </Search>
);

const CustomSearchResultsPanel = () => {
    const { data, onClose } = useSearchResult();

    return (
        <ul>
            {data.map(searchResult => (
                <li key={searchResult.id}>
                    <Link to={searchResult.url} onClick={onClose}>
                        <strong>{searchResult.content.label}</strong>
                    </Link>
                    <p>{searchResult.content.description}</p>
                </li>
            ))}
        </ul>
    );
};
```
