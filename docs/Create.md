---
layout: default
title: "The Create Component"
---

# `<Create>`

The `<Create>` component is the main component for creation pages. It prepares a form submit handler, and renders the page title and actions. It is not responsible for rendering the actual form - that's the job of its child component (usually a form component, like [`<SimpleForm>`](./SimpleForm.md)). This form component uses its children ([`<Input>`](./Inputs.md) components) to render each form input.

![post creation form](./img/create-view.png)

The `<Create>` component creates a `RecordContext` with an empty object `{}` by default. It also creates a [`SaveContext`](./useSaveContext.md) containing a `save` callback, which calls `dataProvider.create()`, and [a `CreateContext`](./useCreateContext.md) containing both the record and the callback.

## Usage

Wrap the `<Create>` component around the form you want to create, then pass it as `create` prop of a given `<Resource>`. `<Create>` requires no prop by default - it deduces the resource from the current URL.

For instance, the following component will render a creation form with 4 inputs when users browse to `/posts/create`:

```jsx
// in src/posts.js
import * as React from 'react';
import { Create, SimpleForm, TextInput, DateInput, required } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} fullWidth />
            <TextInput source="teaser" multiline={true} label="Short description" />
            <RichTextInput source="body" />
            <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
        </SimpleForm>
    </Create>
);

// in src/App.js
import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostCreate } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        <Resource name="posts" create={PostCreate} />
    </Admin>
);

export default App;
```

You can customize the `<Create>` component using the following props:

* [`actions`](#actions): override the actions toolbar with a custom component
* [`aside`](#aside): component to render aside to the main content
* `children`: the components that renders the form
* `className`: passed to the root component
* [`component`](#component): override the root component
* [`disableAuthentication`](#disableauthentication): disable the authentication check
* [`mutationOptions`](#mutationoptions): options for the `dataProvider.create()` call
* [`record`](#record): initialize the form with a record
* [`redirect`](#redirect): change the redirect location after successful creation
* [`resource`](#resource): override the name of the resource to create
* [`sx`](#sx-css-api): Override the styles
* [`title`](#title): override the page title
* [`transform`](#transform): transform the form data before calling `dataProvider.create()`

## `actions`

You can replace the list of default actions by your own elements using the `actions` prop:

```jsx
import * as React from 'react';
import Button from '@mui/material/Button';
import { TopToolbar, Create } from 'react-admin';

const PostCreateActions = () => (
    <TopToolbar>
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
);

export const PostCreate = () => (
    <Create actions={<PostCreateActions />}>
        ...
    </Create>
);
```

## `aside`

![Aside component](./img/aside.png)

You may want to display additional information on the side of the form. Use the `aside` prop for that, passing the component of your choice:

{% raw %}
```jsx
const Aside = () => (
    <Box sx={{ width: '200px', margin: '1em' }}>
        <Typography variant="h6">Instructions</Typography>
        <Typography variant="body2">
            Posts will only be published once an editor approves them
        </Typography>
    </Box>
);

const PostCreate = () => (
    <Create aside={<Aside />}>
       // ...
    </Create>
);
```
{% endraw %}

## `component`

By default, the `<Create>` view render the main form inside a Material UI `<Card>` element. The actual layout of the form depends on the `Form` component you're using ([`<SimpleForm>`](./SimpleForm.md), [`<TabbedForm>`](./TabbedForm.md), or a custom form component).

Some form layouts also use `Card`, in which case the user ends up seeing a card inside a card, which is bad UI. To avoid that, you can override the main page container by passing a `component` prop :

```jsx
// use a div as root component
const PostCreate = () => (
    <Create component="div">
        ...
    </Create>
);

// use a custom component as root component 
const PostCreate = () => (
    <Create component={MyComponent}>
        ...
    </Create>
);
```

The default value for the `component` prop is `Card`.

## `disableAuthentication`

By default, the `<Create>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a creation page, set the `disableAuthentication` prop to `true`.

```jsx
const PostCreate = () => (
    <Create disableAuthentication>
        ...
    </Create>
);
```

## `mutationOptions`

You can customize the options you pass to react-query's `useMutation` hook, e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.create()` call.

{% raw %}
```jsx
import { Create, SimpleForm } from 'react-admin';

const PostCreate = () => (
    <Create mutationOptions={{ meta: { foo: 'bar' } }}>
        <SimpleForm>
            ...
        </SimpleForm>
    </Create>
);
```
{% endraw %}

You can also use `mutationOptions` to override success or error side effects, by setting the `mutationOptions` prop. Refer to the [useMutation documentation](https://tanstack.com/query/v3/docs/react/reference/useMutation) in the react-query website for a list of the possible options.

Let's see an example with the success side effect. By default, when the save action succeeds, react-admin shows a notification, and redirects to the new record edit page. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRedirect, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/posts/${data.id}`);
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

The default `onSuccess` function is:

```js
(data) => {
    notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
    redirect('edit', resource, data.id, data);
}
```

**Tip**: If you just want to customize the redirect behavior, you can use [the `redirect` prop](#redirect) instead.

**Tip**: If you want to have different success side effects based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save and redirect to the list", and another to "save and display an empty form"), you can set the `mutationOptions` prop on [the `<SaveButton>` component](./SaveButton.md), too.

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows an error notification.

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();

    const onError = (error) => {
        notify(`Could not create post: ${error.message}`);
    };

    return (
        <Create mutationOptions={{ onError }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

The `onError` function receives the error from the `dataProvider.create()` call. It is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', { type: 'error' });
}
```

**Tip**: If you want to have different failure side effects based on the button clicked by the user, you can set the `mutationOptions` prop on the `<SaveButton>` component, too.

## `record`

The `record` prop allows to initialize the form with non-empty values. It is exposed for consistency with the `<Edit>` component, but if you need default values, you should use the `defautValues` prop on the Form element instead.

## `redirect`

By default, submitting the form in the `<Create>` view redirects to the `<Edit>` view.

You can customize the redirection by setting the `redirect` prop to one of the following values:

- `'edit'`: redirect to the Edit view (the default)
- `'list'`: redirect to the List view
- `'show'`: redirect to the Show view
- `false`: do not redirect

```jsx
const PostCreate = () => (
    <Create redirect="list">
        ...
    </Create>
);
```

Note that the `redirect` prop is ignored if you set [the `mutationOptions` prop](#mutationoptions). See that prop for how to set a different redirection path in that case. 

If you want to allow the user to enter several records one after the other, setting `redirect` to `false` won't make it, as the form isn't emptied by default. You'll have to empty the form using the `mutationOptions`, and this option disables the `redirect` prop. Check [the Save And Add Another section](#save-and-add-another) for more details.

## `resource`

Components based on `<Create>` are often used as `<Resource create>` props, and therefore rendered when the URL matches `/[resource]/create`. The `<Create>` component generates a call to `dataProvider.create()` using the resource name from the URL by default.

You can decide to use a `<Create>` component in another path, or embedded in a page using another resource name (e.g. in a Dialog). In that case, you can explicitly set the `resource` name:

```jsx
const PostCreate = () => (
    <Create resource="posts">
        ...
    </Create>
);
```

## `sx`: CSS API

The `<Create>` components accept the usual `className` prop, but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following keys:

| Rule name               | Description                                                                          |
|-------------------------|--------------------------------------------------------------------------------------|
| `& .RaCreate-main`      | Applied to the main container                                                        |
| `& .RaCreate-noActions` | Applied to the main container when `actions` prop is `false`                         |
| `& .RaCreate-card`      | Applied to the child component inside the main container (Material UI's `Card` by default)   |

To override the style of all instances of `<Create>` components using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaCreate` key.

## `title`

By default, the title for the `Create` view is "Create [resource_name]".

You can customize this title by specifying a custom `title` prop:

```jsx
export const PostCreate = () => (
    <Create title="New post">
        ...
    </Create>
);
```

The `title` value can be a string or a React element.

## `transform`

To transform a record after the user has submitted the form but before the record is passed to `dataProvider.create()`, use the `transform` prop. It expects a function taking a record as argument, and returning a modified record. For instance, to add a computed field upon creation:

```jsx
export const UserCreate = (props) => {
    const transform = data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    });
    return (
        <Create {...props} transform={transform}>
            ...
        </Create>
    );
}
```

The `transform` function can also return a `Promise`, which allows you to do all sorts of asynchronous calls (e.g. to the `dataProvider`) during the transformation.

**Tip**: If you want to have different transformations based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save", and another to "save and notify other admins"), you can set the `transform` prop on [the `<SaveButton>` component](./SaveButton.md), too.

## Cleaning Up Empty Strings

As a reminder, HTML form inputs always return strings, even for numbers and booleans. So the empty value for a text input is the empty string, not `null` or `undefined`. This means that the data sent to `dataProvider.create()` will contain empty strings:

```js
{
    title: '',
    average_note: '',
    body: '',
    // etc.
}
```

If you prefer to have `null` values, or to omit the key for empty values, use [the `transform` prop](#transform) to sanitize the form data before submission:

```jsx
export const UserCreate = (props) => {
    const transform = (data) => {
        const sanitizedData = {};
        for (const key in data) {
            if (typeof data[key] === "string" && data[key].length === 0) continue;
            sanitizedData[key] = data[key]; 
        }
        return sanitizedData;
    };
    return (
        <Create {...props} transform={transform}>
            ...
        </Create>
    );
}
```

## Adding `meta` To The DataProvider Call

Use [the `mutationOptions` prop](#mutationoptions) to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.create()` call.

{% raw %}
```jsx
import { Create, SimpleForm } from 'react-admin';

const PostCreate = () => (
    <Create mutationOptions={{ meta: { foo: 'bar' } }}>
        <SimpleForm>
            ...
        </SimpleForm>
    </Create>
);
```
{% endraw %}

## Changing The Notification Message

Once the `dataProvider` returns successfully after save, users see a generic notification ("Element created"). You can customize this message by passing a custom success side effect function in [the `mutationOptions` prop](#mutationoptions):

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRedirect, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Post created successfully`); // default message is 'ra.notification.created'
        redirect('edit', 'posts', data.id, data);
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

You can do the same for error notifications, by passing a custom `onError`  callback.

**Tip**: The notification message will be translated.

## Prefilling the Form

You sometimes need to pre-populate a record based on a *related* record. For instance, to create a comment related to an existing post. 

By default, the `<Create>` view starts with an empty `record`. However, if the `location` object (injected by [react-router-dom](https://reacttraining.com/react-router/web/api/location)) contains a `record` in its `state`, the `<Create>` view uses that `record` instead of the empty object. That's how the `<CloneButton>` works under the hood.

That means that if you want to create a link to a creation form, presetting *some* values, all you have to do is to set the location `state`. `react-router-dom` provides the `<Link>` component for that:

{% raw %}
```jsx
import * as React from 'react';
import { Datagrid, useRecordContext } from 'react-admin';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CreateRelatedCommentButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={{
                pathname: '/comments/create',
            }}
            state={{ record: { post_id: record.id } }}
        >
            Write a comment for that post
        </Button>
    );
};

export default PostList = () => (
    <List>
        <Datagrid>
            ...
            <CreateRelatedCommentButton />
        </Datagrid>
    </List>
)
```
{% endraw %}

**Tip**: To style the button with the main color from the Material UI theme, use the `Link` component from the `react-admin` package rather than the one from `react-router-dom`.

**Tip**: The `<Create>` component also watches the "source" parameter of `location.search` (the query string in the URL) in addition to `location.state` (a cross-page message hidden in the router memory). So the `CreateRelatedCommentButton` could also be written as:

{% raw %}
```jsx
import * as React from 'react';
import { useRecordContext } from 'react-admin';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const CreateRelatedCommentButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={{
                pathname: '/comments/create',
                search: `?source=${JSON.stringify({ post_id: record.id })}`,
            }}
        >
            Write a comment for that post
        </Button>
    );
};
```
{% endraw %}

Should you use the location `state` or the location `search`? The latter modifies the URL, so it's only necessary if you want to build cross-application links (e.g. from one admin to the other). In general, using the location `state` is a safe bet.

And if you want to prefill the form with constant values, use the `defaultValues` prop on the Form tag.

**Tip**: [The `<Clonebutton>` component](./CloneButton.md) redirects to a Creation view prefilled with the same data as the current context. You can use it e.g. in a `<Datagrid>`, or in the `<Edit actions>` toolbar.

## Save And Add Another

When users need to create several records in a row, a good UX is to stay on the Create form after a successfull submission, and to empty that form to allow a new entry. 

Setting the `<Create redirect={false}>` prop only solves part of the problem: the form still needs to be emptied. That's why the right implementation for this use case is to add a custom `<SaveButton>` in the form toolbar, making useof  the `mutationOptions` prop:

{% raw %}
```jsx
import * as React from 'react';
import {
    Create,
    SaveButton,
    SimpleForm,
    Toolbar,
    useNotify,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

const PostCreateToolbar = () => {
    const notify = useNotify();
    const { reset } = useFormContext();

    return (
        <Toolbar>
            <SaveButton
                type="button"
                label="post.action.save_and_add"
                variant="text"
                mutationOptions={{
                    onSuccess: () => {
                        reset();
                        window.scrollTo(0, 0);
                        notify('ra.notification.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                    },
                }}
            />
        </Toolbar>
    );
};

const PostCreate = () => {
    return (
        <Create>
            <SimpleForm toolbar={<PostCreateToolbar />}>
                ...
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

You can also leave the choice to the user, by supplying two submit buttons: one with a redirect, and one with a form reset. The same technique applies: use the `mutationOptions` prop on the `<SaveButton>` component.

Note: In order to get the `mutationOptions` being considered, you have to set the `type` prop of the `SaveButton` to `button`.

## Creating A New Record In A Modal

`<Create>` is designed to be a page component, passed to the `create` prop of the `<Resource>` component. But you may want to let users create a record from another page. 

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/ra-enterprise/modules/assets/create-dialog.webm" type="video/webm" />
  <source src="https://marmelab.com/ra-enterprise/modules/assets/create-dialog.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

* If you want to allow creation from the `list` page, use [the `<CreateDialog>` component](./CreateDialog.md)
* If you want to allow creation from another page, use [the `<CreateInDialogButton>` component](./CreateInDialogButton.md)

## Linking Two Inputs

Edition forms often contain linked inputs, e.g. country and city (the choices of the latter depending on the value of the former).

React-admin relies on [react-hook-form](https://react-hook-form.com/) for form handling. You can grab the current form values using react-hook-form's [useWatch](https://react-hook-form.com/docs/usewatch) hook.

```jsx
import * as React from 'react';
import { Edit, SimpleForm, SelectInput } from 'react-admin';
import { useWatch } from 'react-hook-form';

const countries = ['USA', 'UK', 'France'];
const cities = {
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    UK: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
};
const toChoices = items => items.map(item => ({ id: item, name: item }));

const CityInput = props => {
    const country = useWatch({ name: 'country' });
    return (
        <SelectInput
            choices={country ? toChoices(cities[country]) : []}
            {...props}
        />
    );
};

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <SelectInput source="country" choices={toChoices(countries)} />
            <CityInput source="cities" />
        </SimpleForm>
    </Edit>
);

export default OrderEdit;
```

**Tip:** If you'd like to avoid creating an intermediate component like `<CityInput>`, or are using an `<ArrayInput>`, you can use the [`<FormDataConsumer>`](./Inputs.md#linking-two-inputs) component as an alternative.
