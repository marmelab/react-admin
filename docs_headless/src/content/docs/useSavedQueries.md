---
title: "useSavedQueries"
storybook_path: ra-core-list-filter-usesavedqueries--basic
---

This hook allows to read and write saved queries for a specific resource. Saved queries store a combination of filters, sort order, page size, and displayed filters that users can save and reuse later. The data is persisted in the [Store](./Store.md).

## Usage

```jsx
import { useSavedQueries } from 'ra-core';

const [savedQueries, setSavedQueries] = useSavedQueries(resource);
```

The `resource` parameter should be a string representing the resource name (e.g., 'posts', 'users').

The hook returns a tuple with:
- `savedQueries`: an array of `SavedQuery` objects for the specified resource
- `setSavedQueries`: a function to update the saved queries array

This hook is typically used within a list context where filter values, sort order, and pagination state are available. It's commonly used to implement saved query functionality in filter sidebars:

```jsx
import { ListBase, useSavedQueries, useListContext } from 'ra-core';

const MyListComponent = () => (
    <ListBase>
        <SavedQueriesComponent />
        {/* Other list components */}
    </ListBase>
);
```

The saved queries are stored per resource using the pattern `${resource}.savedQueries` in the store, ensuring that each resource maintains its own set of saved queries.

## SavedQuery Interface

```typescript
interface SavedQuery {
    label: string;
    value: {
        filter?: any;
        displayedFilters?: any[];
        sort?: SortPayload;
        perPage?: number;
    };
}
```

## Example Component Implementation

```jsx
import { useSavedQueries, useListContext, extractValidSavedQueries } from 'ra-core';
import isEqual from 'lodash/isEqual.js';

const SavedQueriesComponent = () => {
    const { resource, filterValues, displayedFilters, sort, perPage } = useListContext();
    const [savedQueries, setSavedQueries] = useSavedQueries(resource);
    const validSavedQueries = extractValidSavedQueries(savedQueries);
    
    const hasFilterValues = !isEqual(filterValues, {});
    const hasSavedCurrentQuery = validSavedQueries.some(savedQuery =>
        isEqual(savedQuery.value, {
            filter: filterValues,
            sort,
            perPage,
            displayedFilters,
        })
    );

    const addQuery = () => {
        const newSavedQuery = {
            label: 'My Custom Query',
            value: {
                filter: filterValues,
                sort,
                perPage,
                displayedFilters,
            },
        };
        const newSavedQueries = extractValidSavedQueries(savedQueries);
        setSavedQueries(newSavedQueries.concat(newSavedQuery));
    };

    const removeQuery = () => {
        const savedQueryToRemove = {
            filter: filterValues,
            sort,
            perPage,
            displayedFilters,
        };
        const newSavedQueries = extractValidSavedQueries(savedQueries);
        const index = newSavedQueries.findIndex(savedQuery =>
            isEqual(savedQuery.value, savedQueryToRemove)
        );
        setSavedQueries([
            ...newSavedQueries.slice(0, index),
            ...newSavedQueries.slice(index + 1),
        ]);
    };

    return (
        <div>
            <h3>Saved Queries</h3>
            {validSavedQueries.length === 0 && (
                <p>No saved queries yet. Set a filter to save it.</p>
            )}
            <ul>
                {validSavedQueries.map((savedQuery, index) => (
                    <li key={index}>
                        {savedQuery.label}
                    </li>
                ))}
            </ul>
            {hasFilterValues && !hasSavedCurrentQuery && (
                <button onClick={addQuery}>
                    Save current query
                </button>
            )}
            {hasSavedCurrentQuery && (
                <button onClick={removeQuery}>
                    Remove current query
                </button>
            )}
        </div>
    );
};
```

## Helper Functions

The hook is often used with these helper functions:

### `extractValidSavedQueries`

Filters out invalid saved queries from an array:

```jsx
import { extractValidSavedQueries } from 'ra-core';

const validQueries = extractValidSavedQueries(savedQueries);
```

### `isValidSavedQuery`

Validates whether a saved query has the correct structure:

```jsx
import { isValidSavedQuery } from 'ra-core';

const isValid = isValidSavedQuery(savedQuery);
```

A valid saved query must have:
- A non-empty string `label`
- A `value` object containing:
  - `displayedFilters`: array
  - `perPage`: number
  - `sort.field`: string
  - `sort.order`: string  
  - `filter`: object