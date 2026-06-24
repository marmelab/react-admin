---
layout: default
title: "useChoicesContext"
---

# `useChoicesContext`

The [`<ReferenceInput>`](./ReferenceInput.md) and [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) components create a `ChoicesContext` to store the choices, as well as filters, pagination, sort state, and callbacks to update them.

The `ChoicesContext` is very similar to the [`ListContext`](./useListContext.md) with the exception that it does not return a `data` property but 3 choices related properties:

- `availableChoices`: The choices that are not selected but match the parameters (sorting, pagination and filters)
- `selectedChoices`: The selected choices. 
- `allChoices`: Merge of both available and selected choices. 

## Usage

Call `useChoicesContext` in a component, then use this component as a descendant of a `ReferenceInput` or `ReferenceArrayInput` component.

```jsx
// in src/comments/PostInput.js
import { AutocompleteInput, useChoicesContext } from 'react-admin';

export const PostInput = (props) => {
    const { setFilters, displayedFilters } = useChoicesContext();

    const handleCheckboxChange = (event, checked) => {
        setFilters({ published: checked }, displayedFilters);
    };

    return (
        <>
            <AutocompleteInput {...props} />
            <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Only published posts"
                onChange={handleCheckboxChange}
            />
        </>
    );
};

// in src/comments/CommentCreate.js
import { Create, ReferenceInput, SimpleForm, TextInput } from 'react-admin';
import { PostInput } from './PostInput';

export const CommentCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="post_id" reference="posts">
                <PostInput />
            </ReferenceInput>
            <TextInput source="body" />
        </SimpleForm>
    </Create>
)
```

## Return Value

The `useChoicesContext` hook returns an object with the following keys:

```jsx
const {
    // fetched data
    allChoices, // an array of the choices records, e.g. [{ id: 123, title: 'hello world' }, { ... }], both available and selected. 
    availableChoices, // an array of the available choices records, e.g. [{ id: 123, title: 'hello world' }, { ... }],. 
    selectedChoices, // an array of the selected choices records, e.g. [{ id: 123, title: 'hello world' }, { ... }],. 
    total, // the total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    isFetching, // boolean that is true while the data is being fetched, and false once the data is fetched
    isLoading, // boolean that is true until the data has been fetched for the first time
    isPending, // boolean that is true until the data is available for the first time
    error, // Will contain any error that occurred while fetching data
    // pagination
    page, // the current page. Starts at 1
    perPage, // the number of results per page. Defaults to 25
    setPage, // a callback to change the page, e.g. setPage(3)
    setPerPage, // a callback to change the number of results per page, e.g. setPerPage(25)
    hasPreviousPage, // boolean, true if the current page is not the first one
    hasNextPage, // boolean, true if the current page is not the last one
    // sorting
    sort, // a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
    setSort, // a callback to change the sort, e.g. setSort({ field: 'name', order: 'ASC' })
    // filtering
    filter, // The permanent filter values, e.g. { title: 'lorem', nationality: 'fr' }
    filterValues, // a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
    displayedFilters, // a dictionary of the displayed filters, e.g. { title: true, nationality: true }
    setFilters, // a callback to update the filters, e.g. setFilters(filters, displayedFilters)
    showFilter, // a callback to show one of the filters, e.g. showFilter('title', defaultValue)
    hideFilter, // a callback to hide one of the filters, e.g. hideFilter('title')
    // misc
    resource, // the resource name, deduced from the location. e.g. 'posts'
    refetch, // callback for fetching the list data again
    source, // the name of the field containing the currently selected record(s).
} = useChoicesContext();
```
