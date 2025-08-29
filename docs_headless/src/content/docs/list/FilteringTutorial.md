---
title: "Filtering the List"
---

One of the most important features of the List page is the ability to filter the results. React-admin offers powerful filter components, and gets out of the way when you want to go further.

With headless components from ra-core, you can build custom filter interfaces tailored to your specific needs. The key patterns include:

- **Filter Forms**: Custom forms that update filter state on change
- **Quick Filters**: Toggle-able filter chips for common filter values  
- **Filter Sidebars**: Panel-based filters for categorical data
- **Dynamic Filters**: Interfaces that allow users to add/remove filters on demand

All filter implementations use the `useListContext` hook to access and modify filter state, ensuring seamless integration with react-admin's data fetching and URL synchronization.


## Filter Query Parameter

React-admin uses the `filter` query parameter from the URL to determine the filters to apply to the list.

Here is a typical List page URL in a react-admin application:

> <https://myadmin.dev/#/posts?displayedFilters=%7B%22commentable%22%3Atrue%7D&filter=%7B%22commentable%22%3Atrue%2C%22q%22%3A%22lorem%20%22%7D&order=DESC&page=1&perPage=10&sort=published_at>

Once decoded, the `filter` query parameter reveals as a JSON value:

```
filter={"commentable":true,"q":"lorem "}
```

This leads to the following data provider call:

```js
dataProvider.getList('posts', {
    filter: { commentable: true, q: 'lorem ' },
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'published_at', order: 'DESC' },
});
```

When a user adds or remove a filter, react-admin changes the `filter` query parameter in the URL, and the `<List>` components fetches `dataProvider.getList()` again with the new filters.

**Tip**: Once a user sets a filter, react-admin persists the filter value in the application state, so that when the user comes back to the list, they should see the filtered list. That's a design choice.

**Tip**: You can change the filters programmatically by updating the query parameter, e.g. using the `<Link>` component or the `useNavigate()` hook from `react-router-dom`.

## Linking To A Pre-Filtered List

As the filter values are taken from the URL, you can link to a pre-filtered list by setting the `filter` query parameter.

For instance, if you have a list of tags, you can display a button for each category to link to the list of posts filtered by that tag:

```jsx
import { useRecordContext } from 'ra-core';
import { Link } from 'react-router-dom';

const LinkToRelatedProducts = () => {
    const record = useRecordContext();
    return record ? (
        <Link
            to={{
                pathname: '/posts',
                search: `filter=${JSON.stringify({ category_id: record.id })}`,
            }}
        >
            All posts with the category {record.name}
        </Link>
    ) : null;
};
```

**Tip:** You can also create a custom Menu button with that technique to link to the unfiltered list by setting the filter value to `{}`.

## Filter Operators

The internal format for storing filters and sending them to the dataProvider is an object, e.g.:

```js
{ commentable: true, q: "lorem " }
```

This is fine for equality filters, but how can you do more complex filters, like "between", "contains", "starts with", "greater than", etc.?

As there is no standard way to pass such complex filters to APIs, react-admin makes no decision about it. It's up to you to decide how to store them in the filter object.

The demos show one possible way: suffix the filter name with an operator, e.g. "_gte" for "greater than or equal to".

```jsx
const postFilters = [
    <DateInput source="released_gte" label="Released after" />,
    <DateInput source="released_lte" label="Released before" />
];
```

Some API backends (e.g. JSON Server) know how to handle this syntax. If your API doesn't understand these 'virtual fields', you will have to transform them into the expected syntax in the Data Provider.

```jsx
// in dataProvider.js
export default {
    getList: (resource, params) => {
        // transform a filter object to a filters array with operators
        // filter is like { commentable: true, released_gte: '2018-01-01' }
        const filter = params.filter;
        const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' };
        // filters is like [
        //    { field: "commentable", operator: "=", value: true},
        //    { field: "released", operator: ">=", value: '2018-01-01'}
        // ]
        const filters = Object.keys(filter).map(key => {
            const operator = operators[key.slice(-4)];
            return operator
                ? { field: key.slice(0, -4), operator, value: filter[key] }
                : { field: key, operator: '=', value: filter[key] };
        });
        const query = {
            pagination: params.pagination,
            sort: params.sort,
            filter: filters,
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(),10),
        }));
    },
    // ...
}
```

## Building a Custom Filter

<video controls autoplay playsinline muted loop>
  <source src="../img/filter_with_submit.webm" type="video/webm"/>
  <source src="../img/filter_with_submit.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

With headless components, you have complete control over how filters are built and submitted. React-admin provides two main approaches for building custom filter forms:

1. **Using `<FilterLiveForm>`**: A headless component that automatically updates the filter when the form input values change
2. **Using Filter Callbacks**: Manual control using `useListContext` callbacks for custom behavior like submit-on-click

Let's explore both approaches.

### Using `<FilterLiveForm>`

The `<FilterLiveForm>` component from ra-core provides the easiest way to create a filter form that automatically updates the list state as users type. You just need to wrap your filter inputs with `<FilterLiveForm>`:

```jsx
import { FilterLiveForm } from 'ra-core';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';

const LiveFilterForm = () => (
    <FilterLiveForm>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '16px', border: '1px solid #ccc' }}>
            <div>
                <label>Search:</label>
                <TextInput
                    source="q"
                    placeholder="Search posts..."
                    style={{ padding: '8px', marginLeft: '8px' }}
                />
            </div>
            
            <div>
                <label>Category:</label>
                <SelectInput
                    source="category"
                    choices={[
                        { id: '', name: 'All categories' },
                        { id: 'news', name: 'News' },
                        { id: 'tutorials', name: 'Tutorials' },
                        { id: 'reviews', name: 'Reviews' }
                    ]}
                    style={{ padding: '8px', marginLeft: '8px' }}
                />
            </div>
            
            <div>
                <label>Published:</label>
                <SelectInput
                    source="published"
                    choices={[
                        { id: '', name: 'All' },
                        { id: 'true', name: 'Published' },
                        { id: 'false', name: 'Draft' }
                    ]}
                    style={{ padding: '8px', marginLeft: '8px' }}
                />
            </div>
        </div>
    </FilterLiveForm>
);
```

**Note**: With `<FilterLiveForm>`, input components use the `source` attribute to map to filter keys, and the component automatically handles the synchronization with the list state. The input components need to integrate with react-hook-form via `useInput` from ra-core for the automatic updates to work properly.

### Filter Callbacks

The custom filter components can use [the `useListContext` hook](./useListContext.md) to interact with the list filters. The hook returns the following constants:

- `filterValues`: Value of the filters based on the URI, e.g. `{ "commentable": true, "q": "lorem" }`
- `setFilters()`: Callback to set the filter values, e.g. `setFilters({ "commentable":true })`
- `displayedFilters`: Names of the filters currently displayed (useful for toggle-based filter UIs)
- `showFilter()`: Callback to display an additional filter (useful for dynamic filter UIs)
- `hideFilter()`: Callback to hide a filter (useful for dynamic filter UIs)

Let's use this knowledge to write custom filter components for headless implementations.

### Filter Form With Submit

With headless components, you have complete control over how filters are built and submitted. For instance, you might want to create a filter form that submits only when users click a submit button, rather than on every input change.

Here's an example of a custom filter form with submit functionality:

```jsx
import { useState } from 'react';
import { useListContext } from 'ra-core';

const CustomFilterForm = () => {
    const { filterValues, setFilters } = useListContext();
    const [localFilters, setLocalFilters] = useState(filterValues);

    const handleInputChange = (source, value) => {
        setLocalFilters(prev => ({ ...prev, [source]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFilters(localFilters);
    };

    const handleReset = () => {
        setLocalFilters({});
        setFilters({});
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ccc' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                <div>
                    <label>Search:</label>
                    <input
                        type="search"
                        value={localFilters.q || ''}
                        onChange={(e) => handleInputChange('q', e.target.value)}
                        placeholder="Search..."
                        style={{ padding: '4px', marginLeft: '8px' }}
                    />
                </div>
                
                <div>
                    <label>Commentable:</label>
                    <select
                        value={localFilters.commentable || ''}
                        onChange={(e) => handleInputChange('commentable', e.target.value ? JSON.parse(e.target.value) : undefined)}
                        style={{ padding: '4px', marginLeft: '8px' }}
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                
                <button 
                    type="submit"
                    style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#1976d2', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Filter
                </button>
                
                <button 
                    type="button"
                    onClick={handleReset}
                    style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#f5f5f5', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Clear
                </button>
            </div>
        </form>
    );
};
```

### Dynamic Filter Controls

Here's another example.

You can create dynamic filter controls that allow users to add/remove filters on demand:

```jsx
import { useListContext } from 'ra-core';

const DynamicFilterControls = () => {
    const { filterValues, setFilters, displayedFilters, showFilter, hideFilter } = useListContext();
    
    const availableFilters = [
        { source: 'q', label: 'Search' },
        { source: 'category', label: 'Category' },
        { source: 'published', label: 'Published' },
        { source: 'author', label: 'Author' }
    ];

    const handleAddFilter = (source) => {
        showFilter(source);
    };

    const handleRemoveFilter = (source) => {
        const newFilters = { ...filterValues };
        delete newFilters[source];
        setFilters(newFilters);
        hideFilter(source);
    };

    const handleFilterChange = (source, value) => {
        const newFilters = { ...filterValues, [source]: value };
        setFilters(newFilters);
    };

    return (
        <div style={{ padding: '16px', border: '1px solid #ccc', marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
                <strong>Add Filter: </strong>
                {availableFilters
                    .filter(f => !displayedFilters.includes(f.source))
                    .map(filter => (
                        <button
                            key={filter.source}
                            onClick={() => handleAddFilter(filter.source)}
                            style={{
                                marginRight: '8px',
                                padding: '4px 8px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            + {filter.label}
                        </button>
                    ))}
            </div>

            <div>
                {displayedFilters.map(source => {
                    const filter = availableFilters.find(f => f.source === source);
                    if (!filter) return null;
                    
                    return (
                        <div key={source} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                            <label style={{ marginRight: '8px', minWidth: '80px' }}>
                                {filter.label}:
                            </label>
                            <input
                                type="text"
                                value={filterValues[source] || ''}
                                onChange={(e) => handleFilterChange(source, e.target.value)}
                                style={{ padding: '4px', marginRight: '8px', flex: 1 }}
                            />
                            <button
                                onClick={() => handleRemoveFilter(source)}
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
```

### Using Custom Filters in Your List

To use these custom filter components in your list, simply include them in your `ListBase`:

```jsx
import { ListBase } from 'ra-core';

export const PostList = () => (
    <ListBase>
        <div>
            <h1>Posts</h1>
            <CustomFilterForm />
            {/* or */}
            <DynamicFilterControls />
            {/* Your list content */}
        </div>
    </ListBase>
);
```

You can use a similar approach to offer alternative User Experiences for data filtering, e.g. to display the filters inline with your data table or in any custom layout you prefer.
