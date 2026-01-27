---
title: "useSupportCreateSuggestion"
storybook_path: ra-core-controller-input-usesupportcreatesuggestion--use-support-create-suggestion
---

This hook provides support for creating new suggestions in choice-based inputs like autocomplete components. It allows users to create new options when the desired choice doesn't exist in the available options, either through an `onCreate` callback or by rendering a creation form.

## Usage

```jsx
import { useSupportCreateSuggestion } from 'ra-core';

const {
    createId,
    createHintId,
    getCreateItem,
    handleChange,
    createElement,
    getOptionDisabled,
} = useSupportCreateSuggestion({
    filter: searchValue,
    handleChange: (eventOrValue) => {
      // update your input value
      setValue(eventOrValue?.target?.value ?? eventOrValue?.id);
    },
    onCreate: async (filter) => {
      // create a new option and return it
      return await createNewOption(filter);
    },
});
```

The hook accepts a configuration object and returns utilities for handling suggestion creation in choice inputs.

## Parameters

| Prop              | Required | Type                                        | Default              | Description                                                                   |
| ----------------- | -------- | ------------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `create`          | No       | `ReactElement`                              | -                    | React element rendered when users choose to create a new choice               |
| `createLabel`     | No       | `ReactNode`                                 | `'ra.action.create'` | Label for the create choice item                                              |
| `createItemLabel` | No       | `string \| ((filter: string) => ReactNode)` | -                    | Dynamic label that receives the filter value as parameter                     |
| `createValue`     | No       | `string`                                    | `'@@ra-create'`      | Value for the create choice item                                              |
| `createHintValue` | No       | `string`                                    | `'@@ra-create-hint'` | Value for the disabled hint item                                              |
| `filter`          | No       | `string`                                    | -                    | Current filter/search value entered by the user                               |
| `handleChange`    | Yes      | `(value: any) => void`                      | -                    | Function to call when the input value changes                                 |
| `onCreate`        | No       | `(filter?: string) => any \| Promise<any>`  | -                    | Function called when creating a new option (if `create` element not provided) |
| `optionText`      | No       | `OptionText`                                | `'name'`             | Property name for the option text                                             |

## Return Value

The hook returns an object with:

- `createId`: The ID value for the create option
- `createHintId`: The ID value for the create hint (disabled) option
- `getCreateItem`: Function that returns the create option object
- `handleChange`: Enhanced change handler that intercepts create actions
- `createElement`: React element to render for creation form (null when not creating)
- `getOptionDisabled`: Function to determine if an option should be disabled (i.e. if it's a hint)

## Example with onCreate Callback

```jsx
import { useSupportCreateSuggestion } from 'ra-core';
import { useState } from 'react';

const AuthorInput = () => {
    const [value, setValue] = useState('');
    const [filter, setFilter] = useState('');
    
    const {
        getCreateItem,
        handleChange,
        getOptionDisabled,
    } = useSupportCreateSuggestion({
        filter,
        handleChange: (eventOrValue) => {
          setValue(eventOrValue?.target?.value ?? eventOrValue?.id);
        },
        onCreate: async (authorName) => {
            // Call your API to create a new author
            return await createNewAuthor(authorName);
        },
        createItemLabel: 'Create author "%{item}"',
    });

    const createItem = getCreateItem(filter);
    const options = [
        ...existingAuthors,
        createItem,
    ];

    return (
        <div>
            <input 
                type="text"
                placeholder="Search authors..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <select value={value} onChange={handleChange}>
                {options.map(option => (
                    <option 
                        key={option.id}
                        value={option.id}
                        disabled={getOptionDisabled(option)}
                    >
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
```

## Example with Create Element

When you need more control over the creation process, you can provide a React element to be rendered for creating new options.

This form component can use `useCreateSuggestionContext` to access:

- `filter`: The search filter that triggered the creation
- `onCancel`: Function to cancel the creation and hide the form
- `onCreate`: Function to call when creation succeeds, passing the new item

```jsx
import { 
    useSupportCreateSuggestion,
    useCreateSuggestionContext,
    CreateBase 
} from 'ra-core';

const CreateAuthorForm = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    
    return (
        <CreateBase
            resource="authors"
            redirect={false}
            mutationOptions={{
                onSuccess: onCreate,
            }}
        >
            <SimpleForm defaultValues={{ name: filter }}>
                <TextInput source="name" />
                <TextInput source="email" />
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </SimpleForm>
        </CreateBase>
    );
};

const AuthorInput = () => {
    const [value, setValue] = useState('');
    const [filter, setFilter] = useState('');
    
    const {
        getCreateItem,
        handleChange,
        createElement,
        getOptionDisabled,
    } = useSupportCreateSuggestion({
        filter,
        handleChange: (eventOrValue) => {
          setValue(eventOrValue?.target?.value ?? eventOrValue?.id);
        },
        create: <CreateAuthorForm />,
        createItemLabel: 'Create author "%{item}"',
    });

    const createItem = getCreateItem(filter);
    const options = [
        ...existingAuthors,
        createItem,
    ];

    return (
        <div>
            <input 
                type="text"
                placeholder="Search authors..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <select value={value} onChange={handleChange}>
                {options.map(option => (
                    <option 
                        key={option.id}
                        value={option.id}
                        disabled={getOptionDisabled(option)}
                    >
                        {option.name}
                    </option>
                ))}
            </select>
            {createElement}
        </div>
    );
};
```

## `create`

Provides a React element that will be rendered when users choose to create a new option. When this prop is provided, the hook will render the element instead of calling `onCreate`. The element should use `useCreateSuggestionContext` to access the filter value and callback functions.

```jsx
const CreateForm = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    
    const handleSubmit = async (data) => {
        try {
            const newItem = await createItem(data);
            onCreate(newItem); // This will select the new item and close the form
        } catch (error) {
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input defaultValue={filter} name="name" />
            <button type="submit">Create</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

useSupportCreateSuggestion({
    create: <CreateForm />
});
```

## `createLabel`

Sets the label for the create option. Can be a string, translation key, or any React node.

```jsx
useSupportCreateSuggestion({
    createLabel: 'Add new item'
});
```

## `createItemLabel`

Provides a dynamic label that receives the filter value as a parameter. When provided, this creates two different behaviors:
- With no filter: Shows a disabled hint option (using the `createLabel` text)
- With filter: Shows an active create option with the filter value (using `createItemLabel`)

This provides better UX by guiding users on how to create new options.

```jsx
useSupportCreateSuggestion({
    createItemLabel: 'Create category "%{item}"',
    // When filter is "Sports", shows: "Create category 'Sports'"
});

// Or as a function:
useSupportCreateSuggestion({
    createItemLabel: (filter) => `Add "${filter}" as new category`
});
```

## `createValue`

Customizes the value used internally to identify the create option. This is useful if the default value conflicts with your data.

```jsx
useSupportCreateSuggestion({
    createValue: '@@my-create-id'
});
```

## `createHintValue`

Customizes the value used for the disabled hint option when `createItemLabel` is provided and no filter is set.

```jsx
useSupportCreateSuggestion({
    createHintValue: '@@my-hint-id'
});
```

## `filter`

The current search/filter value entered by the user. This value is used to populate the create option label and is passed to the `onCreate` callback or the create element context.

```jsx
const [searchValue, setSearchValue] = useState('');

useSupportCreateSuggestion({
    filter: searchValue
});
```

## `handleChange`

The function to call when the input value changes. The hook will intercept changes that match the create value and handle them specially, otherwise it will call this function with the original event or value.

```jsx
useSupportCreateSuggestion({
    handleChange: (eventOrValue) => {
        setValue(eventOrValue?.target?.value ?? eventOrValue?.id);
    }
});
```

## `onCreate`

A function called when creating a new option, if the `create` element is not provided. Should return the newly created item.

```jsx
useSupportCreateSuggestion({
    onCreate: async (filterValue) => {
        // create a new option and return it
        return await createNewOption(filterValue);
    }
});
```

## `optionText`

Specifies which property of the option objects contains the display text. If your options use a different property than `name`, specify it here.

```jsx
useSupportCreateSuggestion({
    optionText: 'title', // Uses 'title' instead of 'name'
});

// Also accepts function for more complex scenarios
useSupportCreateSuggestion({
    optionText: (option) => `${option.firstName} ${option.lastName}`
});
```
