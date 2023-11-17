---
layout: default
title: "The Search Component"
---

# `<Search>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component, part of [`ra-search`](https://marmelab.com/ra-enterprise/modules/ra-search), lets user do a site-wide search via a smart Omnibox.

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-demo.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/ra-search-demo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<Search>` renders a global search input. It's designed to be integrated into the top `<AppBar>`.

It relies on the `dataProvider` to provide a `search()` method, so you can use it with any search engine (Lucene, ElasticSearch, Solr, Algolia, Google Cloud Search, and many others). And if you don't have a search engine, no problem! `<Search>` can also do the search across several resources [via parallel `dataProvider.getList()` queries](https://marmelab.com/ra-enterprise/modules/ra-search#addsearchmethod-helper).

## Usage

### Install `ra-search`

The `<Search>` component is part of the `@react-admin/ra-search` package. To install it, run:

```sh
yarn add '@react-admin/ra-search'
```

This requires a valid subscription to [React-admin Enterprise Edition](https://marmelab.com/ra-enterprise).

### Implement `dataProvider.search()`

Your `dataProvider` should support the `search()` method. It should return a Promise for `data` containing an array of `SearchResult` objects and a `total`. A `SearchResult` contains at least the following fields:

- `id`: Identifier The unique identifier of the search result
- `type`: An arbitrary string which enables grouping
- `url`: The URL where to redirect to on click. It could be a custom page and not a resource if you want to
- `content`: Can contain any data that will be used to display the result. If used with the default `<SearchResultItem>` component, it must contain at least an `id`, `label`, and a `description`.
- `matches`: An optional object containing an extract of the data with matches. Can be anything that will be interpreted by a `<SearchResultItem>`

As for the `total`, it can be greater than the number of returned results. This is useful e.g. to show that there are more results.

Here is an example

```jsx
dataProvider.search("roll").then((response) => console.log(response));
// {
//     data: [
//         { id: 'a7535', type: 'artist', url: '/artists/7535', content: { label: 'The Rolling Stones', description: 'English rock band formed in London in 1962'  } }
//         { id: 'a5352', type: 'artist', url: '/artists/5352', content: { label: 'Sonny Rollins', description: 'American jazz tenor saxophonist'  } }
//         { id: 't7524', type: 'track', url: '/tracks/7524', content: { label: 'Like a Rolling Stone', year: 1965, recordCompany: 'Columbia', artistId: 345, albumId: 435456 } }
//         { id: 't2386', type: 'track', url: '/tracks/2386', content: { label: "It's Only Rock 'N Roll (But I Like It)", year: 1974, artistId: 7535, albumId: 6325 } }
//         { id: 'a6325', type: 'album', url: '/albums/6325', content: { label: "It's Only rock 'N Roll", year: 1974, artistId: 7535 }}
//     ],
//     total: 5
// }
```

It is your responsibility to add this search method to your `dataProvider` so that react-admin can send queries to and read responses from the search engine.

If you don't have a search engine, you can use the `addSearchMethod` helper to add a `dataProvider.search()` method that does a parallel `dataProvider.getList()` query for each resource.

```jsx
// in src/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';
import { addSearchMethod } from '@react-admin/ra-search';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = addSearchMethod(baseDataProvider, [
    // search across these resources
    'artists',
    'tracks',
    'albums',
]);
```

Check [the `ra-search` documentation](https://marmelab.com/ra-enterprise/modules/ra-search) to learn more about the input and output format of `dataProvider.search()`, as well as the possibilities to customize the `addSearchMethod`.

### Option 1: With `<Layout>`

If you're using [the `<Layout` component](./Layout.md), include the `<Search>` component inside a custom `<AppBar>` component:

```jsx
// in src/MyAppBar.jsx
import { AppBar, TitlePortal } from "react-admin";
import { Search } from "@react-admin/ra-search";

export const MyAppbar = () => (
  <AppBar>
    <TitlePortal />
    <Search />
  </AppBar>
);
```

Include that AppBar in [a custom layout component](./Layout.md):

```jsx
// in src/MyLayout.jsx
import { Layout } from "react-admin";
import { MyAppbar } from "./MyAppBar";

export const MyLayout = (props) => <Layout {...props} appBar={MyAppbar} />;
```

Finally, include that custom layout in the `<Admin>`.

```jsx
// in src/Admin.ts
import { Admin } from "react-admin";

import { dataProvider } from "./dataProvider";
import { MyLayout } from "./MyLayout";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    layout={MyLayout}
  >
    // ...
  </Admin>
);
```

### Option 2: With `<ContainerLayout>`

If you're using [the `<ContainerLayout>` component](./ContainerLayout.md), you can use the `<Search>` component directly in the `toolbar` prop:

```tsx
// in src/MyLayout.jsx
import { ContainerLayout } from "@react-admin/ra-navigation";
import { Search } from "@react-admin/ra-search";

const MyLayout = (props: any) => (
    <ContainerLayout {...props} maxWidth="xl" toolbar={<Search />} />
);
```

Then, import that custom layout in the `<Admin>`:

```jsx
// in src/Admin.ts
import { Admin } from "react-admin";

import { dataProvider } from "./dataProvider";
import { MyLayout } from "./MyLayout";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    layout={MyLayout}
  >
    // ...
  </Admin>
);
```

## Props

The `<Search>` component accepts the following props:

| Prop          | Required | Type      | Default                | Description                                                                                        |
| ------------- | -------- | --------- | ---------------------- | -------------------------------------------------------------------------------------------------- |
| `children`    | Optional | `Element` | `<SearchResultsPanel>` | A component that will display the results.                                                         |
| `color`       | Optional | `string`  | `light`                | The color mode for the input, applying light or dark backgrounds. Accept either `light` or `dark`. |
| `historySize` | Optional | `number`  | 5                      | The number of past queries to keep in history.                                                     |
| `options`     | Optional | `Object`  | -                      | An object containing options to apply to the search.                                               |
| `wait`        | Optional | `number`  | 500                    | The delay of debounce for the search to launch after typing in ms.                                 |

## `children`

The `<Search>` children allow you to customize the way results are displayed. The child component can grab the search result using the `useSearchResult` hook.

```tsx
import { Admin, AppBar, TitlePortal, Layout } from 'react-admin';
import { Search, useSearchResult } from '@react-admin/ra-search';

const CustomSearchResultsPanel = () => {
    const { data, onClose } = useSearchResult();

    return (
        <ul>
            {data.map(searchResult => (
                <li key={searchResult.id}>{searchResult.content.label}</li>
            ))}
        </ul>
    );
};

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <Search>
            <CustomSearchResultsPanel />
        </Search>
    </AppBar>
);

const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;

export const App = () => (
    <Admin dataProvider={searchDataProvider} layout={MyLayout}>
        // ...
    </Admin>
);
```

## `color`

If you need it, you can choose to render the `light` or the `dark` version of search input.

```tsx
<Search color="dark" />
```

## `historySize`

The number of previous user searches to keep in the popover. For example, if a user performs 10 searches and `historySize` is set to 5, the popover will display the user's last 5 queries.

```tsx
<Search historySize={5} />
```

## `options`

An object containing options to apply to the search:

-   `targets`:`string[]`: an array of the indices on which to perform the search. Defaults to an empty array.
-   `{any}`:`{any}`: any custom option to pass to the search engine.

## `wait`

The number of milliseconds to wait before processing the search request, immediately after the user enters their last character.

```tsx
<Search wait={200} />
```

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
