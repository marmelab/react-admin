---
layout: default
title: "The Create and Edit Views"
---

# The Create and Edit Views

`<Resource>` maps URLs to components - it takes care of *routing*. When you set a component as the `create` prop for a Resource, react-admin renders that component when users go to the `/[resource]/create` URL. When you set a component as the `edit` prop for a resource, react-admin renders that component when users go to the `/[resource]/:id` URL. 

```
<Resource name="posts" create={PostCreate} edit={PostEdit} />
                               ----------        --------
                                    |               |
    displayed when browsing to /posts/create        |
                                                    |
                    displayed when browsing to /posts/123
```

You can pass any component you want as `create` of `edit` props of a `<Resource>`. But you'll probably want to fetch a record based on the URL, and display a form to edit that record. That's what the `<Create>` and `<Edit>` components do. So in most cases, the component passed as `create` view uses the react-admin `<Create>` component, and the component passed as `edit` view uses the react-admin `<Edit>` component. Here is an example:

{% raw %}
```jsx
// in src/App.js
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostCreate, PostEdit } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        <Resource name="posts" create={PostCreate} edit={PostEdit} />
    </Admin>
);

export default App;

// in src/posts.js
import * as React from "react";
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <RichTextInput source="body" />
            <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
        </SimpleForm>
    </Create>
);

export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled label="Id" source="id" />
            <TextInput source="title" validate={required()} />
            <TextInput multiline source="teaser" validate={required()} />
            <RichTextInput source="body" validate={required()} />
            <DateInput label="Publication date" source="published_at" />
            <ReferenceManyField label="Comments" reference="comments" target="post_id">
                <Datagrid>
                    <TextField source="body" />
                    <DateField source="created_at" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

That's enough to display the post edit form:

![post edition form](./img/post-edition.png)

**Tip**: You might find it cumbersome to repeat the same input components for both the `<Create>` and the `<Edit>` view. In practice, these two views almost never have exactly the same form inputs. For instance, in the previous snippet, the `<Edit>` view shows related comments to the current post, which makes no sense for a new post. Having two separate sets of input components for the two views is, therefore, a deliberate choice. However, if you have the same set of input components, export them as a custom Form component to avoid repetition.

## The `<AccordionForm>` Component

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative layout for Edit and Create forms, where Inputs are grouped into expandable panels.

![AccordionForm](https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-form-overview.gif)

```jsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';

import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';

// don't forget the component="div" prop on the main component to disable the main Card
const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm autoClose>
            <AccordionFormPanel label="Identity">
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="dob" label="born" validate={required()} />
                <SelectInput source="sex" choices={sexChoices} />
            </AccordionFormPanel>
            <AccordionFormPanel label="Occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </AccordionFormPanel>
            <AccordionFormPanel label="Preferences">
                <SelectInput
                    source="language"
                    choices={languageChoices}
                    defaultValue="en"
                />
                <BooleanInput source="dark_theme" />
                <BooleanInput source="accepts_emails_from_partners" />
            </AccordionFormPanel>
        </AccordionForm>
    </Edit>
);
```

You can also use the `<AccordionSection>` component as a child of `<SimpleForm>` for secondary inputs:

![Accordion section](https://marmelab.com/ra-enterprise/modules/assets/ra-accordion-section-overview.gif)

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout) for more details.

## The `<WizardForm>` Component

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers an alternative layout for large Create forms, allowing users to enter data step-by-step.

![WizardForm](https://marmelab.com/ra-enterprise/modules/assets/ra-wizard-form-overview.gif)

```jsx
import * as React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm, WizardFormStep } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardFormStep label="First step">
                <TextInput source="title" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="Second step">
                <TextInput source="description" />
            </WizardFormStep>
            <WizardFormStep label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardFormStep>
        </WizardForm>
    </Create>
);
```

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout) for more details.

## The `<CreateDialog>` and `<EditDialog>` Components

These [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> components offer an alternative layout for adding or updating a record without leaving the context of the list page.

![EditDialog](https://marmelab.com/ra-enterprise/modules/assets/edit-dialog.gif)

```jsx
import * as React from 'react';
import { List, Datagrid, SimpleForm, TextField, TextInput, DateInput, required } from 'react-admin';
import { EditDialog, CreateDialog } from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List>
            <Datagrid>
                ...
            </Datagrid>
        </List>
        <EditDialog {...props}>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="date_of_birth" label="born" validate={required()} />
            </SimpleForm>
        </EditDialog>
        <CreateDialog {...props}>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="date_of_birth" label="born" validate={required()} />
            </SimpleForm>
        </CreateDialog>
    </>
);
```

Check [the `ra-form-layout` documentation](https://marmelab.com/ra-enterprise/modules/ra-form-layout) for more details.



## Redirection After Submission

By default:

- Submitting the form in the `<Create>` view redirects to the `<Edit>` view
- Submitting the form in the `<Edit>` view redirects to the `<List>` view

You can customize the redirection by setting the `redirect` prop on the `<Create>` or `<Edit>` components. Possible values are "edit", "show", "list", and `false` to disable redirection. You may also specify a custom path such as `/my-custom-route`. For instance, to redirect to the `<Show>` view after edition:

```jsx
export const PostEdit = () => (
    <Edit redirect="show">
        <SimpleForm>
            ...
        </SimpleForm>
    </Edit>
);
```

You can also pass a custom route (e.g. "/home") or a function as `redirect` prop value. For example, if you want to redirect to a page related to the current object:

```jsx
// redirect to the related Author show page
const redirect = (resource, id, data) => `/author/${data.author_id}/show`;

export const PostEdit = () => (
    <Edit redirect={redirect}>
        <SimpleForm>
            // ...
        </SimpleForm>
    </Edit>
);
```

This affects both the submit button, and the form submission when the user presses `ENTER` in one of the form fields.

**Tip**: The `redirect` prop is ignored if you've set the `onSuccess` prop in the `<Edit>`/`<Create>` component, or in the `<SaveButton>` component.

**Tip**: You may wonder why the `redirect` prop does the same thing as `onSuccess`: that's for historical reasons. The recommended way is to change redirection using `onSuccess` rather than `redirect`. 

## Toolbar

At the bottom of the form, the toolbar displays the submit button. You can override this component by setting the `toolbar` prop, to display the buttons of your choice.


### CSS API

The `<Toolbar>` accepts the usual `className` prop, but you can override many class names injected to the inner components by React-admin thanks to the `classes` property (as most MUI components, see their [documentation about it](https://mui.com/customization/components/#overriding-styles-with-classes)). This property accepts the following keys:

| Rule name                      | Description                                                                            |
|--------------------------------|----------------------------------------------------------------------------------------|
| `& .RaToolbar-defaultToolbar`  | Applied to the internal wrapper of the `<Toolbar>` buttons when no children are passed |
| `&.RaToolbar-desktopToolbar`   | Applied to the underlying `MuiToolbar` component for medium and large screens          |
| `&.RaToolbar-mobileToolbar`    | Applied to the underlying `MuiToolbar` component for small screens                     |

To override the style of all instances of `<Toolbar>` components using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaToolbar` key.

**Tip**: Use react-admin's `<Toolbar>` component instead of MUI's `<Toolbar>` component. The former builds upon the latter and adds support for an alternative mobile layout (and is therefore responsive).

**Tip**: To alter the form values before submitting, you should use the `transform` prop on the `SaveButton`. See [Altering the Form Values before Submitting](#altering-the-form-values-before-submitting) for more information and examples.

## Customizing The Form Layout

You can customize each row in a `<SimpleForm>` or in a `<TabbedForm>` by passing props to the Input components:

* `className`
* [`variant`](#variant)
* [`margin`](#margin)
* [`formClassName`](#formclassname)
* [`fullWidth`](#fullwidth)

You can find more about these props in [the Input documentation](./Inputs.md#common-input-props).

You can also [wrap inputs inside containers](#custom-row-container), or [create a custom Form component](#custom-form-component), alternative to `<SimpleForm>` or `<TabbedForm>`.

### Variant

By default, react-admin input components use the Material Design "filled" variant. If you want to use the "standard" or "outlined" variants, you can set the `variant` prop on each Input component individually.

```jsx
export const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" variant="standard">
        </SimpleForm>
    </Edit>
);
```

### Margin

By default, react-admin input components use the Material Design "dense" margin. If you want to use the "normal" or "none" margins, you can set the `margin` prop on each Input component individually.

```jsx
export const PostEdit = () => (
    <Edit>
        <SimpleForm >
            <TextInput source="name" margin="normal">
        </SimpleForm>
    </Edit>
);
```

### SimpleForm component

By default, the `SimpleForm` view renders the main form's children inside a `CardContentInner`, an internal `react-admin` component which returns a MUI `<CardContent>` element.

To customize that, you can override the main container by passing a `component` prop :

```jsx
const MyChildrenContainerComponent = props => (
    <div>{props.children}</div>
);

// Use a custom component as root container of the form's children 
const PostEdit = () => (
    <Edit>
        <SimpleForm component={MyChildrenContainerComponent}>
            ...
        </SimpleForm>
    </Edit>
);
```

### `formClassName`

The input components are wrapped inside a `div` to ensure a good-looking form by default. You can pass a `formClassName` prop to the input components to customize the style of this `div`. For example, here is how to display two inputs on the same line:

```jsx
import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
} from 'react-admin';
import { makeStyles } from '@mui/material/styles';

const useStyles = makeStyles({
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
});

export const UserEdit = () => {
    const classes = useStyles();
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="first_name" formClassName={classes.inlineBlock} />
                <TextInput source="last_name" formClassName={classes.inlineBlock} />
                {/* This input will be display below the two first ones */}
                <TextInput source="email" type="email" />
            </SimpleForm>
        </Edit>
    )
}
```

### `fullWidth`

If you just need a form row to take the entire form width, use the `fullWidth` prop instead:

```jsx
export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="first_name" fullWidth />
            <TextInput source="last_name" fullWidth />
            <TextInput source="email" type="email" fullWidth />
        </SimpleForm>
    </Edit>
);
```

### Custom Row Container

You may want to customize the styles of Input components by wrapping them inside a container with a custom style. Unfortunately, this doesn't work:

```jsx
export const PostCreate = () => (
    <Create>
        <SimpleForm>
            {/* this does not work */}
            <div className="special-input">
                <TextInput source="title" />
            </div>
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

That's because `<SimpleForm>` clones its children and injects props to them (like `record` or `resource`). Input and Field components expect these props, but DOM elements don't. That means that if you wrap an Input or a Field element in a `<div>`, you'll get a React warning about unrecognized DOM attributes, and an error about missing props in the child.

You can try passing `className` to the Input element directly - all form inputs accept a `className` prop.

Alternatively, you can create a custom Input component:

```jsx
const MyTextInput = props => (
    <div className="special-input">
        <TextInput {...props} />
    </div>
)
export const PostCreate = () => (
    <Create>
        <SimpleForm>
            {/* this works */}
            <MyTextInput source="title" />
            <RichTextInput source="body" />
            <NumberInput source="nb_views" />
        </SimpleForm>
    </Create>
);
```

### Custom Form Component

The `<SimpleForm>` and `<TabbedForm>` layouts are quite simple. In order to better use the screen real estate, you may want to arrange inputs differently, e.g. putting them in groups, adding separators, etc. For that purpose, you need to write a custom form layout, and use it instead of `<SimpleForm>`. 

![custom form layout](./img/custom-form-layout.png)
 
Here is an example of such custom form, taken from the Posters Galore demo. It uses [MUI's `<Box>` component](https://mui.com/components/box/), and it's a good starting point for your custom form layouts.

```jsx
import * as React from "react";
import {
    Form,
    DateInput,
    SelectArrayInput,
    TextInput,
    SaveButton,
    DeleteButton,
    NullableBooleanInput,
} from 'react-admin';
import { Typography, Box, Toolbar } from '@mui/material';

const segments = [
    { id: 'compulsive', name: 'Compulsive' },
    { id: 'collector', name: 'Collector' },
    { id: 'ordered_once', name: 'Ordered Once' },
    { id: 'regular', name: 'Regular' },
    { id: 'returns', name: 'Returns' },
    { id: 'reviewer', name: 'Reviewer' },
];

const VisitorForm = props => (
    <Form {...props}>
        <Box p="1em">
            <Box display="flex">
                <Box flex={2} mr="1em">

                    <Typography variant="h6" gutterBottom>Identity</Typography>

                    <Box display="flex">
                        <Box flex={1} mr="0.5em">
                            <TextInput source="first_name" resource="customers" fullWidth />
                        </Box>
                        <Box flex={1} ml="0.5em">
                            <TextInput source="last_name" resource="customers" fullWidth />
                        </Box>
                    </Box>
                    <TextInput source="email" resource="customers" type="email" fullWidth />
                    <DateInput source="birthday" resource="customers" />
                    <Box mt="1em" />

                    <Typography variant="h6" gutterBottom>Address</Typography>

                    <TextInput resource="customers" source="address" multiline fullWidth />
                    <Box display="flex">
                        <Box flex={1} mr="0.5em">
                            <TextInput source="zipcode" resource="customers" fullWidth />
                        </Box>
                        <Box flex={2} ml="0.5em">
                            <TextInput source="city" resource="customers" fullWidth />
                        </Box>
                    </Box>
                </Box>

                <Box flex={1} ml="1em">
                    
                    <Typography variant="h6" gutterBottom>Stats</Typography>

                    <SelectArrayInput source="groups" resource="customers" choices={segments} fullWidth />
                    <NullableBooleanInput source="has_newsletter" resource="customers" />
                </Box>

            </Box>
        </Box>
        <Toolbar>
            <Box display="flex" justifyContent="space-between" width="100%">
                <SaveButton saving={formProps.saving} />
                <DeleteButton record={props.record} />
            </Box>
        </Toolbar>
    </Form>
);
```

This custom form layout component uses the `Form` component, which leverages react-hook-form's `useForm` hook. It also uses react-admin's `<SaveButton>` and a `<DeleteButton>`.

**Tip**: When `Input` components have a `resource` prop, they use it to determine the input label. `<SimpleForm>` and `<TabbedForm>` inject this `resource` prop to `Input` components automatically. When you use a custom form layout, pass the `resource` prop manually - unless the `Input` has a `label` prop.

To use this form layout, simply pass it as child to an `Edit` component:

```jsx
const VisitorEdit = () => (
    <Edit>
        <VisitorForm />
    </Edit>
);
```

**Tip**: `Form` contains some logic that you may not want. In fact, nothing forbids you from using a react-hook-form [useForm](https://react-hook-form.com/api/useform) hook to create your own form. You'll have to set default values based the injected `record` prop manually, as follows:

{% raw %}
```jsx
import { useForm } from 'react-hook-form';
import { CardContent, Typography, Box } from '@mui/material';

// the parent component (Edit or Create) injects these props to their child
const VisitorForm = ({ record, save, saving, version }) => {
    const form = useForm({
        defaultValues: record,
    });

    const submit = values => {
        save(values);
    };

    return (
        <form
            onSubmit={form.handleSubmit(submit)}
            key={version} // support for refresh button
        >
                {/* render your custom form here */}
        </form>
    );
};
```
{% endraw %}

## Recipes

### Displaying Fields or Inputs Depending on the User Permissions

You might want to display some fields, inputs or filters only to users with specific permissions. 

Before rendering the `Create` and `Edit` components, react-admin calls the `authProvider.getPermissions()` method, and passes the result to the component as the `permissions` prop. It's up to your `authProvider` to return whatever you need to check roles and permissions inside your component.

Here is an example inside a `Create` view with a `SimpleForm` and a custom `Toolbar`:

{% raw %}
```jsx
const UserCreateToolbar = ({ permissions, ...props }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    return (
        <Toolbar {...props}>
            <SaveButton
                label="user.action.save_and_show"            
            />
            {permissions === 'admin' &&
                <SaveButton
                    label="user.action.save_and_add"
                    mutationOptions={{
                        onSuccess: data => {
                            notify('ra.notification.created', {
                                type: 'info',
                                messageArgs: { smart_count: 1 },
                            });
                            redirect(false);
                        }
                    }}
                  
                    type="button"
                    variant="text"
                />}
        </Toolbar>
    );
};

export const UserCreate = () => {
    const { permissions } = useGetPermissions();
    return (
        <Create redirect="show">
            <SimpleForm
                toolbar={<UserCreateToolbar permissions={permissions} />}
                defaultValues={{ role: 'user' }}
            >
                <TextInput source="name" validate={[required()]} />
                {permissions === 'admin' &&
                    <TextInput source="role" validate={[required()]} />}
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

**Tip**: Note how the `permissions` prop is passed down to the custom `toolbar` component.

This also works inside an `Edition` view with a `TabbedForm`, and you can hide a `FormTab` completely:

{% raw %}
```jsx
export const UserEdit = ({ permissions }) =>
    <Edit title={<UserTitle />}>
        <TabbedForm defaultValues={{ role: 'user' }}>
            <FormTab label="user.form.summary">
                {permissions === 'admin' && <TextInput disabled source="id" />}
                <TextInput source="name" validate={required()} />
            </FormTab>
            {permissions === 'admin' &&
                <FormTab label="user.form.security">
                    <TextInput source="role" validate={required()} />
                </FormTab>}
        </TabbedForm>
    </Edit>;
```
{% endraw %}

### Changing The Success or Failure Notification Message

Once the `dataProvider` returns successfully after save, users see a generic notification ("Element created" / "Element updated"). You can customize this message by passing a custom success side effect function as [the `<Edit onSuccess>` prop](#changing-the-success-or-failure-notification-message):

```jsx
import { Edit, useNotify, useRedirect } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const onSuccess = () => {
        notify('Post saved successfully'); // default message is 'ra.notification.updated'
        redirect('list', 'posts');
    }
    return (
        <Edit mutationOptions={{ onSuccess }}>
            ...
        </Edit>
    );
}
```

**Tip**: In `optimistic` and `undoable` mutation modes, react-admin calls the the `onSuccess` callback method with no argument. In `pessimistic` mode, it calls it with the response returned by the dataProvider as argument.

You can do the same for error notifications, e.g. to display a different message depending on the error returned by the `dataProvider`:

```jsx
import * as React from 'react';
import { Edit, useNotify, useRedirect } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const onError = (error) => {
        if (error.code == 123) {
            notify('Could not save changes: concurrent edition in progress', { type: 'warning' });
        } else {
            notify('ra.notification.http_error', { type: 'warning' });
        }
        redirect('list', 'posts');
    }
    return (
        <Edit mutationOptions={{ onError }}>
            ...
        </Edit>
    );
}
```

If the form has several save buttons, you can also pass a custom `onSuccess` or `onError` function to the `<SaveButton>` components, to have a different message and/or redirection depending on the submit button clicked.

**Tip**: The notify message will be translated.

### Grouping Inputs

Sometimes, you may want to group inputs in order to make a form more approachable. You may use a [`<TabbedForm>`](#the-tabbedform-component), an [`<AccordionForm>`](#the-accordionform-component) or you may want to roll your own layout. In this case, you might need to know the state of a group of inputs: whether it's valid or if the user has changed them (dirty/touched state).

For this, you can use the `<FormGroupContextProvider>`, which accepts a group name. All inputs rendered inside this context will register to it (thanks to the `useInput` hook). You may then call the `useFormGroup` hook to retrieve the status of the group. For example:

```jsx
import { Edit, SimpleForm, TextInput, FormGroupContextProvider, useFormGroup, minLength } from 'react-admin';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreIcon';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <FormGroupContextProvider name="options">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="options-content"
                        id="options-header"
                    >
                        <AccordionSectionTitle name="options">
                            Options
                        </AccordionSectionTitle>
                    </AccordionSummary>
                    <AccordionDetails
                        id="options-content"
                        aria-labelledby="options-header"
                    >
                        <TextInput source="teaser" validate={minLength(20)} />
                    </AccordionDetails>
                </Accordion>
            </FormGroupContextProvider>
        </SimpleForm>
    </Edit>
);

const AccordionSectionTitle = ({ children, name }) => {
    const formGroupState = useFormGroup(name);

    return (
        <Typography
          color={
              !formGroupState.isValid && formGroupState.isDirty
                ? 'error'
                : 'inherit'
          }
        >
            {children}
        </Typography>
    );
};
```
