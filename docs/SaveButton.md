---
layout: default
title: "The SaveButton Component"
---

# `<SaveButton>`

The `<SaveButton>` component is a button that is used to submit a form.

![SaveButton](./img/SaveButton.png)

`<SaveButton>` calls the `save` function defined by the main page component (`<Create>` or `<Edit>`), which it grabs from the [`SaveContext`](./useSaveContext.md).

## Usage

Create a `<SaveButton>` with custom UI options, or custom side effects, then use that button in a custom [`<Toolbar>`](./Toolbar.md) that you can inject to `<SimpleForm>` or `<TabbedForm>` using the `toolbar` prop:

```jsx
import { SaveButton, Toolbar, Edit, SimpleForm, useNotify, useRedirect } from 'react-admin';

const PostSaveButton = props => {
    const notify = useNotify();
    const redirect = useRedirect();
    const onSuccess = (response) => {
        notify(`Post "${response.data.title}" saved!`);
        redirect('/posts');
    };
    return <SaveButton {...props} mutationOptions={{ onSuccess }} />;
};

const PostEditToolbar = () => (
    <Toolbar>
        <PostSaveButton />
        <DeleteButton />
    </Toolbar>
);

const PostEdit = () => (
    <Edit>
        <SimpleForm toolbar={<PostEditToolbar />}>
            ...
        </SimpleForm>
    </Edit>
);
```

`<SaveButton>` accepts the following props:

- [`icon`](#icon)
- [`label`](#label)
- [`mutationOptions`](#mutationoptions)
- [`onClick`](#onclick)
- [`alwaysEnable`](#alwaysenable)
- [`sx`](#sx-css-api)
- [`transform`](#transform)
- [`type`](#type)

Additional props (e.g. `color`, `variant`) are passed to [the underlying Material UI `<Button>` component](https://mui.com/components/buttons/).

## `icon`

By default, `<SaveButton>` renders a disk icon. You can can pass another icon element:

```jsx
import AddBoxIcon from '@mui/icons-material/AddBox';
import { SaveButton } from 'react-admin';

const MySaveButton = props => <SaveButton {...props} icon={<AddBoxIcon />} />;
```

## `label`

By default, `<SaveButton>` renders with the "Save" (translated if the user locale isn't English), whether used on a creation or edition form. You can pass another label:

```jsx
const PostCreateToolbar = () => (
    <Toolbar>
        <SaveButton label="Create post" />
    </Toolbar>
);
```

**Tip**: The label will go through [the `useTranslate` hook](./useTranslate.md), so you can use translation keys.

## `mutationOptions`

You can override the `mutationOptions` of the main mutation query (`dataProvider.create()` or `dataProvider.update()`) by passing a `mutationOptions` prop to `<SaveButton>`. This is useful when you have more than one save button.

For instance, to display two save buttons in a creation form, one to save and redirect to the edition page, and the second to save and empty the form:

{% raw %}
```jsx
import { Toolbar, SaveButton, useRedirect, useNotify } from 'react-admin';
import { useFormContext } from 'react-hook-form';

const MyToolbar = () => {
    const { reset } = useFormContext();
    const notify = useNotify();
    return (
        <Toolbar>
            <SaveButton label="Save" />
            <SaveButton 
                label="Save and add"
                mutationOptions={{
                    onSuccess: () => {
                        notify('Element created');
                        reset();
                    }}
                }
                type="button"
                variant="text"
            />
        </Toolbar>
    );
};
```
{% endraw %}

**Tip**: When using custom `mutationOptions`, you must set the button `type` to `button` instead of the default `submit`, otherwise it's the main page's `mutationOptions` that is used.

## `onClick`

You can add an event handler to the `<SaveButton>` by passing an `onClick` callback. 

```jsx
const PostCreateToolbar = () => (
    <Toolbar>
        <SaveButton label="Save" onClick={() => alert('Saving...')} />
    </Toolbar>
);
```

`onClick` doesn't *replace* the default submission handler, since a default `SaveButton` is a submit button, but is instead called before it. To override the default submission handler, wrap a `<SaveButton>` in a custom [`SaveContext`](./useSaveContext.md).

Note that if you call `event.preventDefault()` in `onClick`, the form will not be submitted.
This is especially useful preventing the `<Form>` from being submitted by pressing the `ENTER` key.
By default, pressing `ENTER` in any of the form inputs submits the form - this is the expected behavior in most cases. To disable the automated form submission on enter, set the `type` prop of the `SaveButton` component to `button`.

```jsx
const MyToolbar = () => (
    <Toolbar>
        <SaveButton type="button" />
        <DeleteButton />
    </Toolbar>
);

export const PostEdit = () => (
    <Edit>
        <SimpleForm toolbar={<MyToolbar/>}>
            ...
        </SimpleForm>
    </Edit>
);
```

However, some of your custom input components (e.g. Google Maps widget) may have special handlers for the `ENTER` key. In that case, you should prevent the default handling of the event on those inputs. This would allow other inputs to still submit the form on Enter:

```jsx
export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput
                source="name"
                onKeyUp={event => {
                    if (event.key === 'Enter') {
                        event.stopPropagation();
                    }
                }}
            /> 
        </SimpleForm>
    </Edit>
);
```

**Tip**: `<SaveButton type="button">` does not take into account a custom `onSubmit` prop passed to the enclosing `<Form>`. If you need to override the default submit callback for a `<SaveButton type="button">`, you should include an `onClick` prop in the button.

```jsx
const MyToolbar = () => {
    const [update] = useUpdate();
    const { getValues } = useFormContext();
    const redirect = useRedirect();

    const handleClick = e => {
        e.preventDefault(); // necessary to prevent default SaveButton submit logic
        const { id, ...data } = getValues();
        update(
            'posts',
            { id, data },
            { onSuccess: () => { redirect('list'); }}
        );
    };

    return (
        <Toolbar>
            <SaveButton type="button" onClick={handleClick} />
            <DeleteButton />
        </Toolbar>
    );
};

export const PostEdit = () => (
    <Edit>
        <SimpleForm toolbar={<MyToolbar/>}>
          ...
        </SimpleForm>
    </Edit>
);
```

## `alwaysEnable`

By default, the `<SaveButton>` rendered by `<Toolbar>` is disabled until there is something to save, i.e. until the user changes at least one input. Set `alwaysEnable` to `true` to always enable the button.

```jsx
import { Toolbar, SaveButton } from 'react-admin';

const MyToolbar = () => (
    <Toolbar>
        <SaveButton alwaysEnable />
    </Toolbar>    
);
```

## `sx`: CSS API

The `<SaveButton>` components accept the usual `className` prop, but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)).

{% raw %}
```jsx
const PostCreateToolbar = () => (
    <Toolbar>
        <SaveButton label="Save" sx={{ margin: 2 }} />
    </Toolbar>
);
```
{% endraw %}

To override the style of all instances of `<SaveButton>` components using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaSaveButton` key.

## `transform`

A `<SaveButton>` can specify a callback to transform the record before it is saved. This overrides the `transform` prop defined in the main page `<Edit>` or `<Create>` component.

```jsx
const transformUser = data => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`
});

const UserCreateToolbar = () => (
    <Toolbar>
        <SaveButton transform={transformUser} />
    </Toolbar>
);
```

## `type`

By default, `<SaveButton>` renders a `submit` button. You can change this by passing `type="button"`. It is especially useful when using more than one save button in a form:

{% raw %}
```jsx
import { Toolbar, SaveButton, useRedirect, useNotify } from 'react-admin';
import { useFormContext } from 'react-hook-form';

const MyToolbar = () => {
    const { reset } = useFormContext();
    const notify = useNotify();
    return (
        <Toolbar>
            <SaveButton label="Save" />
            <SaveButton 
                label="Save and add"
                mutationOptions={{
                    onSuccess: () => {
                        notify('Element created');
                        reset();
                    }}
                }
                type="button"
                variant="text"
            />
        </Toolbar>
    );
};
```
{% endraw %}
