---
layout: default
title: "The SearchWithResult Component"
---

# `<SearchWithResult>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> component, part of [`ra-search`](https://react-admin-ee.marmelab.com/documentation/ra-search), renders a search input and the search results directly below the input. It's ideal for dashboards or menu panels.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-search-with-result-solar-layout-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

It relies on the `dataProvider` to provide a `search()` method, so you can use it with any search engine (Lucene, ElasticSearch, Solr, Algolia, Google Cloud Search, and many others). And if you don't have a search engine, no problem! `<SearchWithResult>` can also do the search across several resources [via parallel `dataProvider.getList()` queries](https://react-admin-ee.marmelab.com/documentation/ra-search#addsearchmethod-helper).

By default, `<SearchWithResult>` will group the search results by target, and show their `content.label` and `content.description`.

## Usage

### Install `ra-search`

The `<SearchWithResult>` component is part of the `@react-admin/ra-search` package. To install it, run:

```sh
yarn add '@react-admin/ra-search'
```

This requires a valid subscription to [React-admin Enterprise Edition](https://react-admin-ee.marmelab.com).

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

Then, here's how to include the `<SearchWithResult>` component inside a custom `<Dashboard>` component:

```tsx
import { Card, CardContent } from '@mui/material';
import { Admin } from 'react-admin';
import { SearchWithResult } from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MyDashboard = () => (
    <Card>
        <CardContent>
            <SearchWithResult />
        </CardContent>
    </Card>
);

export const App = () => (
    <Admin dataProvider={searchDataProvider} dashboard={MyDashboard}>
        {/*...*/}
    </Admin>
);
```

Check [the `ra-search` documentation](https://react-admin-ee.marmelab.com/documentation/ra-search) to learn more about the input and output format of `dataProvider.search()`, as well as the possibilities to customize the `addSearchMethod`.

## Props

| Prop           | Required | Type                                                                              | Default                                                                         | Description                                                                                        |
| ------------   | -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `children`     | Optional | `Element`                                                                         | `<SearchResultsPanel>`                                                          | A component that will display the results.                                                         |
| `disableHighlight`    | Optional | `boolean`                                                                         | `false`                | Disable the highlight of the search term of each result.                                                           |
| `onNavigate`   | Optional | `function`                                                                        | `() => undefined`                                                               | A callback function to run when the user navigate to a result.                                     |
| `options`      | Optional | `Object`                                                                          | -                                                                               | An object containing options to apply to the search.                                               |
| `queryOptions` | Optional | [`UseQuery Options`](https://tanstack.com/query/v3/docs/react/reference/useQuery) | -                                                                               | `react-query` options for the search query                                                         |
| `wait`         | Optional | `number`                                                                          | 500                                                                             | The delay of debounce for the search to launch after typing in ms.                                 |

## `children`

The `<SearchWithResult>` children allow you to customize the way results are displayed. The child component can grab the search result using the `useSearchResult` hook.

```tsx
import { Admin } from 'react-admin';
import { SearchWithResult, useSearchResults } from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MyDashboard = () => (
    <SearchWithResult>
        <MySearchResultsPanel />
    </SearchWithResult>
);

const MySearchResultsPanel = () => {
    const { data } = useSearchResults();
    return (
        <ul>
            {data.map(item => (
                <li key={item.id}>{item.content.label}</li>
            ))}
        </ul>
    );
};

export const App = () => (
    <Admin dataProvider={searchDataProvider} dashboard={MyDashboard}>
        {/*...*/}
    </Admin>
);
```

## `disableHighlight`

The search terms in each result are highlighted. You can disable this feature with the `disableHighlight` prop as follows:

```tsx
<SearchWithResults disableHighlight />
```

**Tip:** To customize the highlight style check out the [Customizing the result items](#customizing-the-result-items) section below.

## `onNavigate`

`onNavigate` allows you to perform an action when the user clicks on a search result, e.g. to close a menu ([See below](#use-it-with-solarlayout) for an example with `<SolarLayout>`).

```tsx
import { Admin } from 'react-admin';
import { SearchWithResult } from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MyDashboard = () => {
    const handleNavigate = () => {
        console.log('User navigated to a result');
    };
    return <SearchWithResult onNavigate={handleNavigate} />;
};

export const App = () => (
    <Admin dataProvider={searchDataProvider} dashboard={MyDashboard}>
        {/*...*/}
    </Admin>
);
```

## `options`

An object containing options to apply to the search:

-   `targets`: `string[]`: an array of the indices on which to perform the search. Defaults to an empty array.
-   `{any}`: `{any}`: any custom option to pass to the search engine.

{% raw %}
```tsx
<SearchWithResult options={{ foo: 'bar' }} />
```
{% endraw %}

## `queryOptions`

`<SearchWithResult>` accepts a [`queryOptions` prop](https://tanstack.com/query/v3/docs/framework/react/reference/useQuery) to pass options to the react-query client.
This can be useful e.g. to override the default side effects such as `onSuccess` or `onError`.


{% raw %}
```tsx
<SearchWithResult queryOptions={{ onSuccess: data => console.log(data) }} />
```
{% endraw %}

## `wait`

The number of milliseconds to wait before processing the search request, immediately after the user enters their last character.

```tsx
<SearchWithResult wait={200} />
```

## Customizing the Entire Search Results

Pass a custom React element as a child of `<SearchWithResult>` to customize the appearance of the search results. This can be useful e.g. to customize the results grouping, or to arrange search results differently.

`ra-search` renders the `<SearchResultsPanel>` inside a `SearchContext`. You can use the `useSearchResult` hook to read the search results, as follows:

{% raw %}
```tsx
import { Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Admin } from 'react-admin';
import {
    SearchWithResult,
    SearchResultsPanel,
    useSearchResults,
} from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MyDashboard = () => (
    <Card>
        <CardContent>
            <SearchWithResult>
                <MySearchResultsPanel />
            </SearchWithResult>
        </CardContent>
    </Card>
);

const MySearchResultsPanel = () => {
    const { data } = useSearchResults();
    return (
        <ul style={{ maxHeight: '250px', overflow: 'auto' }}>
            {data.map(item => (
                <li key={item.id}>
                    <Link to={item.url}>
                        <strong>{item.content.label}</strong>
                    </Link>
                    <p>{item.content.description}</p>
                </li>
            ))}
        </ul>
    );
};

export const App = () => (
    <Admin dataProvider={searchDataProvider} dashboard={MyDashboard}>
        {/*...*/}
    </Admin>
);
```
{% endraw %}

## Customizing The Result Items

By default, `<SearchWithResult>` displays the results in `<SearchResultsPanel>`, which displays each results in a `<SearchResultItem>`. So rendering `<SearchWithResult>` without children is equivalent to rendering:

```tsx
const MySearch = () => (
    <SearchWithResult>
        <SearchResultsPanel>
            <SearchResultItem />
        </SearchResultsPanel>
    </SearchWithResult>
);
```

`<SearchResultItem>` renders the `content.label` and `content.description` for each result. You can customize what it renders by providing a function as the `label` and the `description` props. This function takes the search result as a parameter and must return a React element.

For instance:

```tsx
import { Card, CardContent } from '@mui/material';
import Groups3Icon from '@mui/icons-material/Groups3';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { Admin } from 'react-admin';
import {
    SearchWithResult,
    SearchResultsPanel,
    SearchResultItem,
    useSearchResults,
} from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MyDashboard = () => (
    <Card>
        <CardContent>
            <SearchWithResult>
                <SearchResultsPanel>
                    <SearchResultItem
                        label={record => (
                            <>
                                {record.type === 'artists' ? (
                                    <Groups3Icon />
                                ) : (
                                    <LibraryMusicIcon />
                                )}
                                <span>{record.content.label}</span>
                            </>
                        )}
                    />
                </SearchResultsPanel>
            </SearchWithResult>
        </CardContent>
    </Card>
);

export const App = () => (
    <Admin dataProvider={searchDataProvider} dashboard={MyDashboard}>
        {/*...*/}
    </Admin>
);
```

You can also completely replace the search result item component:

```tsx
import { Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Admin } from 'react-admin';
import {
    SearchWithResult,
    SearchResultsPanel,
    SearchResultItem,
} from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MySearchResultItem = ({ data }) => (
    <li key={data.id} className="highlight">
        <Link to={data.url}>
            <strong>{data.content.label}</strong>
        </Link>
        <p>{data.content.description}</p>
    </li>
);

const MyDashboard = () => (
    <Card>
        <CardContent>
            <SearchWithResult>
                <SearchResultsPanel>
                    <MySearchResultItem />
                </SearchResultsPanel>
            </SearchWithResult>
        </CardContent>
    </Card>
);

export const App = () => (
    <Admin dataProvider={searchDataProvider} dashboard={MyDashboard}>
        {/*...*/}
    </Admin>
);
```

**Tip:** You can customize the highlight of the search terms by overriding the `<SearchResultsPanel sx>` prop as following:

{% raw %}
```jsx
const CustomSearch = () => (
    <SearchWithResult>
        <SearchResultsPanel
            sx={{
                '& ::highlight(search)': {
                    backgroundColor: '#7de5fa',
                },
            }}
        />
    </SearchWithResult>
);
```
{% endraw %}

## Use It With SolarLayout

The `<SearchWithResult>` component works perfectly when used inside the [`<SolarLayout>`](https://react-admin-ee.marmelab.com/documentation/ra-navigation#solarlayout) menu.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-search-with-result-solar-layout-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The `useSolarSidebarActiveMenu` hook combined with the `onNavigate` prop allow you to close the `<SolarMenu>` when the user selects an element in the result.

Here is an implementation example:

{% raw %}
```tsx
import type { ReactNode } from 'react';
import { Admin } from 'react-admin';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AlbumIcon from '@mui/icons-material/Album';
import Groups3Icon from '@mui/icons-material/Groups3';
import {
    SolarLayout,
    SolarMenu,
    useSolarSidebarActiveMenu,
} from '@react-admin/ra-navigation';
import { SearchWithResult } from '@react-admin/ra-search';
import { searchDataProvider } from './searchDataProvider';

const MySolarLayout = ({ children }: { children: ReactNode }) => (
    <SolarLayout menu={MySolarMenu}>
        {children}
    </SolarLayout>
);

const MySolarMenu = () => (
    <SolarMenu bottomToolbar={<CustomBottomToolbar />}>
        <SolarMenu.Item
            name="artists"
            to="/artists"
            icon={<Groups3Icon />}
            label="resources.stores.name"
        />
        <SolarMenu.Item
            name="songs"
            to="/songs"
            icon={<AlbumIcon />}
            label="resources.events.name"
        />
    </SolarMenu>
);

const CustomBottomToolbar = () => (
    <>
        <SearchMenuItem />
        <SolarMenu.LoadingIndicatorItem />
    </>
);

const SearchMenuItem = () => {
    const [, setActiveMenu] = useSolarSidebarActiveMenu();
    const handleClose = () => {
        setActiveMenu('');
    };

    return (
        <SolarMenu.Item
            icon={<SearchIcon />}
            label="Search"
            name="search"
            subMenu={
                <Box sx={{ maxWidth: 298 }}>
                    <SearchWithResult onNavigate={handleClose} />
                </Box>
            }
            data-testid="search-button"
        />
    );
};

export const App = () => (
    <Admin dataProvider={searchDataProvider} layout={MySolarLayout}>
        {/*...*/}
    </Admin>
);
```
{% endraw %}