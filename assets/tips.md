You can restrict access to certain pages based on the current user's permissions. For example, to restrict the ability to edit customer details or to add new admin users:

```jsx
const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    {(permissions) => (
      <>
        {/* Restrict access to the edit view to admin only */}
        <Resource
          name="customers"
          list={VisitorList}
          edit={permissions === "admin" ? VisitorEdit : null}
          icon={VisitorIcon}
        />
        {/* Only include the adminUsers resource for admin users */}
        {permissions === "admin" ? (
          <Resource
            name="adminUsers"
            list={CategoryList}
            edit={CategoryEdit}
            icon={CategoryIcon}
          />
        ) : null}
      </>
    )}
  </Admin>
);
```

https://marmelab.com/react-admin/Permissions.html#restricting-access-to-resources-or-views

---

Use `<ReferenceOneField>` with a `sort` prop to display the latest record related to the current one. For instance, to render the latest message in a discussion:

{% raw %}

```jsx
<ReferenceOneField
  reference="messages"
  target="discussion_id"
  sort={{ field: "timestamp", order: "DESC" }}
>
  <TextField source="message" />
</ReferenceOneField>
```

{% endraw %}

https://marmelab.com/react-admin/ReferenceOneField.html#usage

---

Use `useAuthenticated` to restrict access to custom pages to authenticated users.

```jsx
import { useAuthenticated } from "react-admin";

const MyPage = () => {
  useAuthenticated(); // redirects to login if not authenticated
  return <div>...</div>;
};

export default MyPage;
```

https://marmelab.com/react-admin/useAuthenticated.html

---

Add the following theme override to remove bottom gutters on the last row of all `<Datagrid>`, and hence improve the UI of all lists, especially when using rounded corners.

```js
import { defaultTheme } from "react-admin";

export const lightTheme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { border: 0 },
        },
      },
    },
  },
};
```

https://github.com/marmelab/react-admin/blob/master/examples/demo/src/layout/themes.ts#L102

---

If you want to publish a public list page in an application that uses authentication, you must set the `disableAuthentication` prop to `true` on the `<List>` component. #security

```jsx
import { List } from "react-admin";

const BookList = () => <List disableAuthentication>...</List>;
```

https://marmelab.com/react-admin/List.html#disableauthentication

---

If you use `useGetOne` in a custom component that may be used more than once per page, prefer the `useGetManyAggregate` hook to group and deduplicate all API requests into a single one. #performance

```diff
-import { useGetOne, useRecordContext } from 'react-admin';
+import { useGetManyAggregate, useRecordContext } from 'react-admin';

const UserProfile = () => {
    const record = useRecordContext();
-   const { data: user, isLoading, error } = useGetOne('users', { id: record.userId });
+   const { data: users, isLoading, error } = useGetManyAggregate('users', { ids: [record.userId] });
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
-   return <div>User {user.username}</div>;
+   return <div>User {users[0].username}</div>;
};
```

https://marmelab.com/react-admin/useGetOne.html#aggregating-getone-calls

---

The filter sidebar is a great way to let users filter a list by selecting possible filter values with the mouse. But for a full-text search, you need a form input with a watch on the value. That's what `<FilterLiveSearch>` does. #list

```diff
+import { FilterLiveSearch } from 'react-admin';

const FilterSidebar = () => (
    <Card>
        <CardContent>
+           <FilterLiveSearch source="full_name" />
            <LastVisitedFilter />
            <HasOrderedFilter />
            <HasNewsletterFilter />
            <SegmentFilter />
        </CardContent>
    </Card>
);
```

https://marmelab.com/react-admin/FilterLiveSearch.html

---

If you don't use `<Datagrid>` in a list, you'll need a control to let users choose the sort order. The `<SortButton>` component does just that. #list

```jsx
import * as React from "react";
import {
  TopToolbar,
  SortButton,
  CreateButton,
  ExportButton,
} from "react-admin";

const ListActions = () => (
  <TopToolbar>
    <SortButton fields={["reference", "sales", "stock"]} />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);
```

https://marmelab.com/react-admin/SortButton.html

---

Sometimes, the default views from react-admin may not match the design you want. For instance, you may want to have more prominent page titles, add breadcrumbs or display the view actions elsewhere. React-admin provides _base_ components for each view (e.g. `<EditBase>` instead of `<Edit>`). These headless components give you full control over the UI:

```jsx
import * as React from "react";
import { EditBase, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Card } from "@mui/material";

export const BookEdit = () => (
  <EditBase>
    <div>
      <Title title="Book Edition" />
      <Card>
        <SimpleForm>
          <TextInput source="title" />
          <TextInput source="author" />
          <SelectInput source="availability" choices={[
            { id: "in_stock", name: "In stock" },
            { id: "out_of_stock", name: "Out of stock" },
            { id: "out_of_print", name: "Out of print" },
          ]} />
        </SimpleForm>
      </Card>
    </div>
  </EditBase>
);
```

---

When leveraging `<ReferenceInput>` to let users select a related record from a list, you may want to display only a subset of the related records (e.g. only the published posts). You can do so by adding a `filter` prop to the `<ReferenceInput>`. #relationship https://marmelab.com/react-admin/ReferenceInput.html#filter

{% raw %}

```jsx
<ReferenceInput
  source="post_id"
  reference="posts"
  filter={{ is_published: true }}
/>
```

{% endraw %}

---

The `sx` prop is responsive: you can set different values depending on the breakpoint. #style https://marmelab.com/react-admin/Theming.html#sx-overriding-a-component-style

{% raw %}

```jsx
<Box
  sx={{
    width: {
      xs: 100, // theme.breakpoints.up('xs')
      sm: 200, // theme.breakpoints.up('sm')
      md: 300, // theme.breakpoints.up('md')
      lg: 400, // theme.breakpoints.up('lg')
      xl: 500, // theme.breakpoints.up('xl')
    },
  }}
>
  This box has a responsive width.
</Box>
```

{% endraw %}

---

The `<ListLive>` component is a `<List>` that automatically refreshes when the data changes. #list #realtime https://marmelab.com/react-admin/ListLive.html

```jsx
import { Datagrid, TextField } from "react-admin";
import { ListLive } from "@react-admin/ra-realtime";

const PostList = () => (
  <ListLive>
    <Datagrid>
      <TextField source="title" />
    </Datagrid>
  </ListLive>
);
```

---

Don't add an optional "s" to a name depending on the item count: `useTranslate` supports pluralization. #i18n https://marmelab.com/react-admin/useTranslate.html#using-pluralization-and-interpolation

```jsx
const messages = {
    'hello_name': 'Hello, %{name}',
    'count_beer': 'One beer |||| %{smart_count} beers',
};

const translate = useTranslate();

// interpolation
translate('hello_name', { name: 'John Doe' });
=> 'Hello, John Doe.'

// pluralization
translate('count_beer', { smart_count: 1 });
=> 'One beer'

translate('count_beer', { smart_count: 2 });
=> '2 beers'
```

---

`<SelectInput>` can render certain options as disabled. Just set the `disabled:true` property on the option. #input https://marmelab.com/react-admin/SelectInput.html#disablevalue

```jsx
const choices = [
  { id: "tech", name: "Tech" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "people", name: "People", disabled: true },
];
<SelectInput source="category" choices={choices} />;
```

---

If you need to transform or combine multiple values to render a field, `<FunctionField>` is the perfect match.

While `render` is the only required prop, when used inside a `<Datagrid>`, you can also provide a `source` or a `sortBy` prop to make the column sortable. Indeed when a user clicks on a column, `<Datagrid>` uses these props to sort. Should you provide both, `sortBy` will override `source` for sorting the column.

#field https://marmelab.com/react-admin/FunctionField.html

```diff
<Datagrid>
    <FunctionField
+       source="last_name"
        render={customer =>
            customer
                ? `${customer.first_name} ${customer.last_name}`
                : ''
        }
    />
</Datagrid>
```

---

Need to setup a POC quickly and you don't have an API yet? Use the FakeRest data provider and get a local fake REST server based on simple JSON objects! #dataFetching https://www.npmjs.com/package/ra-data-fakerest

```jsx
import * as React from "react";
import { Admin, Resource } from "react-admin";
import fakeDataProvider from "ra-data-fakerest";

const dataProvider = fakeDataProvider({
  posts: [
    { id: 0, title: "Hello, world!" },
    { id: 1, title: "FooBar" },
  ],
  comments: [
    { id: 0, post_id: 0, author: "John Doe", body: "Sensational!" },
    { id: 1, post_id: 0, author: "Jane Doe", body: "I agree" },
  ],
});

import { PostList } from "./posts";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={PostList} />
  </Admin>
);

export default App;
```

---

If the provided form layouts do not suit your needs, you can build your own with the `<Form>` component. #form https://marmelab.com/react-admin/Form.html

```jsx
import {
  Create,
  Form,
  TextInput,
  RichTextInput,
  SaveButton,
} from "react-admin";
import { Grid } from "@mui/material";

export const PostCreate = () => (
  <Create>
    <Form>
      <Grid container>
        <Grid item xs={6}>
          <TextInput source="title" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextInput source="author" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <RichTextInput source="body" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <SaveButton />
        </Grid>
      </Grid>
    </Form>
  </Create>
);
```

---

By default, react-admin synchronizes the `<List>` parameters (sort, pagination, filters) with the query string in the URL (using react-router location).

When you use a `<List>` component anywhere else than as `<Resource list>`, you may want to disable this feature.
This allows, among others, to have multiple lists on a single page.

To do so, pass the `disableSyncWithLocation` prop to the `<List>`.

#list https://marmelab.com/react-admin/List.html#disablesyncwithlocation

```jsx
const Dashboard = () => (
  <div>
    <ResourceContextProvider value="posts">
      <List disableSyncWithLocation>
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => `${record.views} views`}
          tertiaryText={(record) =>
            new Date(record.published_at).toLocaleDateString()
          }
        />
      </List>
    </ResourceContextProvider>
    <ResourceContextProvider value="comments">
      <List disableSyncWithLocation>
        <SimpleList
          primaryText={(record) => record.title}
          secondaryText={(record) => `${record.views} views`}
          tertiaryText={(record) =>
            new Date(record.published_at).toLocaleDateString()
          }
        />
      </List>
    </ResourceContextProvider>
  </div>
);
```

---

If you need to have multiple lists of the same resource in your app, and would like to keep distinct states for each of them (filters, sorting and pagination), you can use the `storeKey` prop to differentiate them.

#list https://marmelab.com/react-admin/List.html#storekey

{% raw %}

```jsx
import * as React from "react";
import { Admin, CustomRoutes, List, Datagrid, TextField } from "react-admin";
import { Route } from "react-router-dom";
import { dataProvider } from "./dataProvider";

const Books = ({ storeKey, order }) => (
  <List resource="books" storeKey={storeKey} sort={{ field: "year", order }}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="author" />
      <TextField source="year" />
    </Datagrid>
  </List>
);

const App = () => (
  <Admin dataProvider={dataProvider}>
    <CustomRoutes>
      <Route
        path="/newerBooks"
        element={<Books storeKey="newerBooks" order="DESC" />}
      />
      <Route
        path="/olderBooks"
        element={<Books storeKey="olderBooks" order="ASC" />}
      />
    </CustomRoutes>
  </Admin>
);
```

{% endraw %}

---

How to build a multi-tenant web app with react-admin? Although this may sound simple, you should NOT do the following. This blog post explains why. #multiTenancy https://marmelab.com/blog/2022/12/14/multitenant-spa.html

```diff
+const tenantId = localStorage.getItem('tenantId');
const { data, isLoading } = useGetList(
    'tickets',
    {
        pagination: { page: 1, perPage: 25 },
        sort: { field: 'id', order: 'DESC' },
-       filter: {},
+       filter: { tenantId },
    },
);
```

---

If you need to build an app relying on more than one API, you can combine multiple data providers into one using the `combineDataProviders` helper. #dataFetching https://marmelab.com/react-admin/DataProviders.html#combining-data-providers

```jsx
import buildRestProvider from "ra-data-simple-rest";
import {
  Admin,
  Resource,
  ListGuesser,
  combineDataProviders,
} from "react-admin";

const dataProvider1 = buildRestProvider("http://path.to.my.first.api/");
const dataProvider2 = buildRestProvider("http://path.to.my.second.api/");

const dataProvider = combineDataProviders((resource) => {
  switch (resource) {
    case "posts":
    case "comments":
      return dataProvider1;
    case "users":
      return dataProvider2;
    default:
      throw new Error(`Unknown resource: ${resource}`);
  }
});

export const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={ListGuesser} />
    <Resource name="comments" list={ListGuesser} />
    <Resource name="users" list={ListGuesser} />
  </Admin>
);
```

---

React Admin's `fetchJson` is a neat utility that makes it easier to query a JSON API with the required headers. It also allows to add your own headers, and handles the JSON decoding of the response. #dataProvider https://marmelab.com/react-admin/fetchJson.html

```js
import { fetchUtils } from "react-admin";
const httpClient = async (url, options = {}) => {
  const { status, headers, body, json } = await fetchUtils.fetchJson(
    url,
    options
  );
  console.log("fetchJson result", { status, headers, body, json });
  return { status, headers, body, json };
};
```

---

If you need to combine several fields in a single cell (in a `<Datagrid>`) or in a single row (in a `<SimpleShowLayout>`), use a `<WrapperField>` to define the `label` and `sortBy` props. #field https://marmelab.com/react-admin/WrapperField.html

```js
import { List, Datagrid, WrapperField, TextField } from "react-admin";

const BookList = () => (
  <List>
    <Datagrid>
      <TextField source="title" />
      <WrapperField label="author" sortBy="author.last_name">
        <TextField source="author_first_name" />
        <TextField source="author_last_name" />
      </WrapperField>
    </Datagrid>
  </List>
);
```

---

If you use `useMediaQuery` to display different content on mobile and desktop, be aware that the component will render twice on mobile - that's a limitation of the hook to support server-side rendering. To avoid that double render, set the `noSsr` option. #mobile https://marmelab.com/react-admin/Theming.html#usemediaquery-hook

```jsx
import { useMediaQuery, Theme } from "@material-ui/core";

const PostList = () => {
  const isSmall =
    useMediaQuery <
    Theme >
    ((theme) => theme.breakpoints.down("md"), { noSsr: true });
  return isSmall ? <PostListMobile /> : <PostListDesktop />;
};
```

---

You can use a `<Show>` Layout component for the `<Datagrid expand>` prop. #datagrid https://marmelab.com/react-admin/Datagrid.html#expand

```jsx
const PostShow = () => (
  <SimpleShowLayout>
    <RichTextField source="body" />
  </SimpleShowLayout>
);

const PostList = () => (
  <List>
    <Datagrid expand={<PostShow />}>
      <TextField source="id" />
      <TextField source="title" />
      <DateField source="published_at" />
      <BooleanField source="commentable" />
      <EditButton />
    </Datagrid>
  </List>
);
```

---

By default, the `polyglotI18nProvider` logs a warning each time a message can’t be found in the translations. This helps track missing translation keys. To silence this, you can pass the `allowMissing` option to Polyglot. #i18n https://marmelab.com/react-admin/TranslationSetup.html#silencing-translation-warnings

```diff
// in src/i18nProvider.js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from './i18n/englishMessages';
import fr from './i18n/frenchMessages';

const i18nProvider = polyglotI18nProvider(locale =>
    locale === 'fr' ? fr : en,
    'en', // Default locale
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' }
    ],
+   { allowMissing: true }
);
```

---

The `<AutocompleteInput>` dropdown has the same width as the input. You can make it larger by specifying a custom `PopperComponent` prop. #autocomplete https://marmelab.com/react-admin/AutocompleteInput.html

{% raw %}

```jsx
import { AutocompleteInput, ReferenceInput, SearchInput } from "react-admin";
import { Popper } from "@mui/material";

const LargePopper = (props: any) => (
  <Popper {...props} style={{ width: 400 }} placement="bottom-start" />
);

const ListFilters = [
  <SearchInput alwaysOn />,
  <ReferenceInput reference="companies" source="company_id" alwaysOn>
    <AutocompleteInput PopperComponent={LargePopper} />
  </ReferenceInput>,
];
```

{% endraw %}

---
If you need to add custom pages in your application, for instance to let users manage their profile (password, preferences, etc), use the `<CustomRoutes>` component. #router https://marmelab.com/react-admin/CustomRoutes.html

```jsx
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";

import dataProvider from './dataProvider';
import posts from './posts';
import comments from './comments';
import Settings from './Settings';
import Profile from './Profile';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```

---

If you'd like to reset the list filters when your users click on a menu item, you can use an empty `filter` query parameter to empty the filters. #list #menu https://marmelab.com/react-admin/Menu.html#resetting-filters-on-menu-click

```jsx
<Menu.Item
    to="/posts?filter=%7B%7D" // %7B%7D is JSON.stringify({})
    primaryText="Posts"
    leftIcon={<BookIcon />}
/>
```

---

If you need to display/hide an input based on the value of another input, the `<FormDataConsumer>` component can help. Also, remember to set the `shouldUnregister` prop, so that when the input is hidden, its value isn’t included in the submitted data. #form https://marmelab.com/react-admin/Inputs.html#hiding-inputs-based-on-other-inputs

{% raw %}

```jsx
import { FormDataConsumer } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm shouldUnregister>
            <BooleanInput source="hasEmail" />
            <FormDataConsumer>
                {({ formData, ...rest }) => formData.hasEmail &&
                    <TextInput source="email" {...rest} />
                }
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);
```

{% endraw %}

---

You can leverage the `useListContext` hook to build your own list UI. #list https://marmelab.com/react-admin/useListContext.html

{% raw %}

```jsx
const CompanyList = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) return null;

    return (
        <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <CompanyCard />
                </RecordContextProvider>
            ))}
        </Box>
    );
};
```

{% endraw %}

---

`<AutocompleteInput>` and `<SelectInput>` both provide an easy way to create new options on-the-fly. Simply use the `onCreate` prop to render a `prompt` to ask users about the new value. #input https://marmelab.com/react-admin/AutocompleteInput.html#oncreate

{% raw %}
```jsx
import { AutocompleteInput, Create, SimpleForm, TextInput } from 'react-admin';

const PostCreate = () => {
    const categories = [
        { name: 'Tech', id: 'tech' },
        { name: 'Lifestyle', id: 'lifestyle' },
    ];
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <AutocompleteInput
                    onCreate={() => {
                        const newCategoryName = prompt('Enter a new category');
                        const newCategory = { id: newCategoryName.toLowerCase(), name: newCategoryName };
                        categories.push(newCategory);
                        return newCategory;
                    }}
                    source="category"
                    choices={categories}
                />
            </SimpleForm>
        </Create>
    );
}
```

{% endraw %}

---

You can customize the preview of an image file dropped in an [`<ImageInput>` component](https://marmelab.com/react-admin/ImageInput.html). Let's replace the default preview provided by `<ImageField>`, with the [MUI Avatar component](https://mui.com/material-ui/react-avatar/):

{% raw %}

```jsx
import { Create, ImageInput, SimpleForm, useRecordContext } from 'react-admin';
import Avatar from '@mui/material/Avatar';

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <ImageInput
                source="file"
                label="Image"
                accept="image/*"
                sx={{
                    '& .RaFileInput-removeButton': {
                        '& button': {
                            top: -20,
                            right: 40,
                            zIndex: 1,
                        },
                    },
                }}
            >
                <Preview />
            </ImageInput>
        </SimpleForm>
    </Create>
);

const Preview = () => {
    const record = useRecordContext();
    return (
        <Avatar
            sx={{ width: 56, height: 56 }}
            alt={record.title}
            src={record.src}
        />
    );
};
```

{% endraw %}

---

`<AutocompleteInput>` accepts the same props as MUI's `<Autocomplete>`. For instance, you can use `filterSelectedOptions` to choose whether or not to display the currently selected option among the list of available choices. #input https://marmelab.com/react-admin/AutocompleteInput.html#additional-props

{% raw %}

```jsx
// Setting filterSelectedOptions to false will include the currently selected option
// in the list of available choices (it will be highlighted in blue)
<AutocompleteInput
    filterSelectedOptions={false}
/>
```

{% endraw %}

---

If your API does not serve a resource as expected by your application, and if you cannot tranform this resource server-side, you can alter it client-side in the `dataProvider` by using `withLifecycleCallbacks`. #dataProvider https://marmelab.com/react-admin/withLifecycleCallbacks.html

{% raw %}
```ts
// in src/dataProvider.ts
import { withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withLifecycleCallbacks(
  baseDataProvider,
  [
    {
      // we want to transform the resource called event
      resource: "events", 
      // transform the resource after getList()
      afterGetList: async (result) => { 
        const events = result.data.map((event) => ({
          id: event.id,
          date: event.created_at,
          author: {
            id: event.user_id,
          },
          resource: "posts",
          action: event.type,
          payload: {
            comment: event.comment,
          },
        }));
        return { data: events, total: result.total };
      },
    },
  ]
);
```
{% endraw %}

---

If you want to style a particular column in a `<Datagrid>`, you can take advantage of the generated class names per column. For instance a field with `source="title"` will have the class `column-title`. #datagrid https://marmelab.com/react-admin/Datagrid.html#styling-specific-columns

{% raw %}

```tsx
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid
            sx={{
                '& .column-title': { backgroundColor: '#fee' },
            }}
        >
            <TextField source="id" />
            <TextField source="title" /> {/* will have different background */}
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);
```

{% endraw %}

---

Instead of defining the same `optionText` prop in multiple `<Input>` or `<Field>`, you can choose a default template using the `recordRepresentation` prop of `<Resource>`. #resource https://marmelab.com/react-admin/Resource.html#recordrepresentation

{% raw %}

```tsx
import { Admin, Resource } from 'react-admin';

const App = () => (
  <Admin>
    <Resource
      name="customers"
      list={CustomerList}
      recordRepresentation={(record) =>
        `${record.first_name} ${record.last_name}`
      }
    />
  </Admin>
);
```

{% endraw %}

---

The `<ReferenceManyField>` provides a `ListContext` to its children, just like the `<List>`. You can leverage that to build richer UI for references. For instance, adding search. https://marmelab.com/react-admin/ReferenceManyField.html

{% raw %}

```tsx
export const PostEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput source="title" />
			<ReferenceManyField reference="comments" target="postId">
				<FilterLiveSearch />
				<Datagrid>
					<TextField source="id" />
					<TextField source="name" />
					<TextField source="email" />
					<TextField source="body" />
				</Datagrid>
			</ReferenceManyField>
		</SimpleForm>
	</Edit>
);
```

{% endraw %}

---

Check the uniqueness of a value in a form with the `useUnique` validator. It checks the validity using `dataProvider.getList()` with a filter param, and fails when a record exists with the current input value.
#form https://marmelab.com/react-admin/useUnique.html

{% raw %}
```tsx
import { SimpleForm, TextInput, useUnique } from 'react-admin';

const UserCreateForm = () => {
    const unique = useUnique();
    return (
        <SimpleForm>
            <TextInput source="username" validate={unique({ message: 'myapp.validation.unique' })} />
        </SimpleForm>
    );
};
```
{% endraw %}

---

In confirmation messages, and on the empty page, the resource name appears in the middle of sentences, as lower case. This works in English, but you may want to display resources in another way, like in German, where names are always capitalized. To do this, simply add a `forcedCaseName` key next to the `name` key in your translation file. #i18n https://marmelab.com/react-admin/TranslationTranslating.html#forcing-the-case-in-confirm-messages-and-empty-page

{% raw %}

```js
{
    resources: {
        comments: {
            name: 'Kommentar |||| Kommentare',
            // Will render "Sind Sie sicher, dass Sie diesen Kommentar löschen möchten?"
            // Instead of "Sind Sie sicher, dass Sie diesen kommentar löschen möchten?"
            forcedCaseName: 'Kommentar |||| Kommentare',
            fields: {
                id: 'Id',
                name: 'Bezeichnung',
            }
        }
    }
}
```

{% endraw %}

---

With `<Datagrid>`, you can select a range of rows by pressing the shift key while clicking on a row checkbox. #datagrid https://marmelab.com/react-admin/Datagrid.html#bulkactionbuttons

<video controls autoplay playsinline muted loop>
  <source src="https://marmelab.com/react-admin/img/datagrid-select-range.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

---

If you need to customize the `<SolarLayout>` appBar that appears on Mobile, you can set the `appBar` prop of `<SolarLayout>`. For instance, here's how you could customize its colors and add some extra content to its far right.
#SolarLayout https://react-admin-ee.marmelab.com/documentation/ra-navigation#appbar-1

{% raw %}
```tsx
const CustomAppBar = () => (
  <SolarAppBar
    sx={{ color: "text.secondary", bgcolor: "background.default" }}
    toolbar={
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box mr={1}>Custom toolbar</Box>
        <Box mr={1}>with</Box>
        <Box mr={1}>multiple</Box>
        <Box mr={1}>elements</Box>
      </Box>
    }
  />
);

const CustomLayout = (props: SolarLayoutProps) => (
  <SolarLayout {...props} appBar={CustomAppBar} />
);
```
{% endraw %}

---

There are several ways to upload files: you can send files as Base64 string, you can send files using multipart/form-data, or you might want to send files to a third party service such as CDN, etc. The Handling File Uploads section of our documentation contains example code for all three, including and example using Cloudinary as CDN.

#dataProvider https://marmelab.com/react-admin/DataProviders.html#handling-file-uploads

{% raw %}
```tsx
export const dataProvider = withLifecycleCallbacks(
    simpleRestProvider('http://path.to.my.api'),
    [
        {
            resource: 'posts',
            beforeSave: async (params: any) => {
                const response = await fetch(
                    'http://path.to.my.api/get-cloudinary-signature',
                    { method: 'GET' }
                ); // get the Cloudinary signature from your backend

                const signData = await response.json();
                const formData = new FormData();
                formData.append('file', params.picture.rawFile);
                formData.append('api_key', signData.api_key);
                // add other Cloudinary parameters here, such as `signature`

                const imageResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${signData.cloud_name}/auto/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const image = await imageResponse.json();
                return {
                    ...params,
                    picture: {
                        src: image.secure_url,
                        title: image.asset_id,
                    },
                };
            },
        },
    ]
);
```
{% endraw %}

---

Most `<List>` children, such as `<Datagrid>`, `<SimpleList>` or `<SingleFieldList>` support the `empty` prop. It accepts a React Component, allowing to customize the content to display when the list is empty. #list https://marmelab.com/react-admin/List.html#empty

{% raw %}
```jsx
const CustomEmpty = () => <div>No books found</div>;

const PostList = () => (
    <List>
        <Datagrid empty={<CustomEmpty />}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```
{% endraw %}

---

If you are implementing a custom list iterator, but don't want to handle the loading state by grabbing the `isLoading` variable from the `ListContext`, a convenient solution is to leverage the `<List emptyWhileLoading>` prop. With it, the `<List>` component won’t render its child component until the data is available. #list https://marmelab.com/react-admin/ListTutorial.html#building-a-custom-iterator

{% raw %}
```jsx
import { List, useListContext } from "react-admin";
import { Stack, Typography } from "@mui/material";

const BookListView = () => {
    const { data } = useListContext();
    return (
        <Stack spacing={2} sx={{ padding: 2 }}>
            {data.map((book) => (
                <Typography key={book.id}>
                    <i>{book.title}</i>, by {book.author} ({book.year})
                </Typography>
            ))}
        </Stack>
    );
};

const BookList = () => (
    <List emptyWhileLoading>
        <BookListView />
    </List>
);
```
{% endraw %}

---

Components based on Material UI `<Dialog>`, like `<EditDialog>` or `<CreateDialog>`, can be set to take up full width by setting the `fullWidth` prop to `true`. It works well in conjunction with the `maxWidth` prop, allowing the dialog to grow only until a given breakpoint. #ui https://marmelab.com/react-admin/EditDialog.html#fullwidth

{% raw %}
```jsx
const MyEditDialog = () => (
  <EditDialog fullWidth maxWidth="sm">
      ...
  </EditDialog>
);
```
{% endraw %}

---

With `<EditableDatagrid>`, if you are providing your own side effects to manage successful or failed save or delete actions, you can leverage the `useRowContext` hook to close the form programmatically. #datagrid #form https://marmelab.com/react-admin/EditableDatagrid.html#providing-custom-side-effects

{% raw %}
```tsx
import { RowForm, useRowContext } from '@react-admin/ra-editable-datagrid';
import { useNotify } from 'react-admin';

const ArtistCreationForm = () => {
    const notify = useNotify();
    const { close } = useRowContext();

    const handleSuccess = response => {
        notify(`Artist ${response.name} ${response.firstName} has been added`);
        close();
    };

    return (
        <RowForm mutationOptions={{ onSuccess: handleSuccess }}>
            {/*...*/}
        </RowForm>
    );
};
```
{% endraw %}

---

When editing a record, if ever the record is refetched and its value has changed, the form will be reset to the new value. If you want to avoid loosing changes already made to the record, you can leverage the `resetOptions` to keep the dirty values. #form https://marmelab.com/react-admin/Form.html#props

{% raw %}
```tsx
<SimpleForm
  resetOptions={{
    keepDirtyValues: true,
  }}
>
  {/*...*/}
</SimpleForm>
```
{% endraw %}

---

If you would like to make the tabs vertical in a `<TabbedShowLayout>`, you can specify a different `orientation` to `<TabbedShowLayoutTabs>`, as they accept the same props as the MUI `<Tabs>` component. #form #layout https://mui.com/material-ui/react-tabs/

{% raw %}
```tsx
<TabbedShowLayout
   tabs={<TabbedShowLayoutTabs orientation="vertical" />}
   sx={{
       display: 'flex',
       flexDirection: 'row',
   }}
>
    {/*...*/}
</TabbedShowLayout>
```
{% endraw %}

---

Instead of numbers, you can pass an array of objects to `<Pagination rowsPerPageOptions>` to specify a custom label corresponding to each value. #list https://marmelab.com/react-admin/List.html#pagination

{% raw %}
```tsx
import { Pagination, List } from 'react-admin';

const PostPagination = () => (
  <Pagination
    rowsPerPageOptions={[
      { label: 'ten', value: 10 },
      { label: 'twenty', value: 20 },
      { label: 'one hundred', value: 100 },
    ]} 
  />
);

export const PostList = () => (
    <List pagination={<PostPagination />}>
        {/*...*/}
    </List>
);
```
{% endraw %}

---

If you render more than one `<DatagridConfigurable>` on the same page, you must pass a unique preferenceKey prop to each one. Do not forget to link their `<SelectColumnsButton>` components by giving them the same preferenceKey. #datagrid https://marmelab.com/react-admin/Datagrid.html#configurable

{% raw %}
```tsx
const PostListActions = () => (
    <TopToolbar>
        <SelectColumnsButton preferenceKey="posts.datagrid" />
    </TopToolbar>
);

const PostList = () => (
    <List actions={<PostListActions />}>
        <DatagridConfigurable preferenceKey="posts.datagrid">
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </DatagridConfigurable>
    </List>
);
```
{% endraw %}

---

If your API answers with an error status after submitting a form and you need to access the error object, you can use the `mutationOptions` prop. #form
https://marmelab.com/react-admin/Edit.html#mutationoptions

{% raw %}
```ts
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, Edit, SimpleForm } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();

    const onError = (error) => {
        notify(`Could not edit post: ${error.message}`);
    };

    return (
        <Edit mutationOptions={{ onError }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Edit>
    );
}
```
{% endraw %}

---

Setting a `QueryClient` with a `staleTime` greater than 0 means that the UI may display stale data. If necessary, you can invalidate the query so that the next `useQuery` hook fetches fresh data.
https://marmelab.com/react-admin/Admin.html#queryclient

{% raw %}
```ts
import { useQueryClient } from "react-query";

const PostEdit = () => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries(["posts", "getOne"]);
  return <PostForm />;
};
```
{% endraw %}

---

Don’t confuse Material-UI’s `useTheme`, which returns the material-ui theme object, with react-admin’s `useTheme`, which lets you read and update the theme name (light or dark). #theme https://marmelab.com/react-admin/useTheme.html

{% raw %}
```ts
import { defaultTheme, useTheme } from 'react-admin';
import { Button } from '@mui/material';

const ThemeToggler = () => {
    const [theme, setTheme] = useTheme();

    return (
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        </Button>
    );
}
```
{% endraw %}

---

If you need to tweak the default layout to add a right column or move the menu to the top, you’re probably better off writing your own layout component (https://marmelab.com/react-admin/Layout.html#writing-a-layout-from-scratch). #layout #style

```tsx
import * as React from 'react';
import { Box } from '@mui/material';
import { AppBar, Menu, Sidebar } from 'react-admin';

const MyLayout = ({ children, dashboard }) => (
    <Box 
        display="flex"
        flexDirection="column"
        zIndex={1}
        minHeight="100vh"
        backgroundColor="theme.palette.background.default"
        position="relative"
    >
        <Box
            display="flex"
            flexDirection="column"
            overflowX="auto"
        >
            <AppBar />
            <Box display="flex" flexGrow={1}>
                <Sidebar>
                    <Menu hasDashboard={!!dashboard} />
                </Sidebar>
                <Box
                    display="flex"
                    flexDirection="column"
                    flexGrow={2}
                    p={3}
                    marginTop="4em"
                    paddingLeft={5}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    </Box>
);

export default MyLayout;
```

---

If you need to override the Layout's global styles (like the default font size or family), you should write a custom theme (https://marmelab.com/react-admin/AppTheme.html#writing-a-custom-theme) rather than override the `<Layout sx>` prop. #layout #style

```tsx
const theme = {
  palette: {
    primary: {
      main: '#FF5733',
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      contrastText: '#47008F',
    },
  },
  spacing: 4,
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
        }
      `,
    },
  },
};
```

---

If you're using the `<RichTextInput>` component, you may want to access the `TipTap` editor object to tweak extensions, input rules, etc. To do so, you can assign a ref in the `onCreate` function in the `editorOptions` prop of your `<RichTextInput>` component. #rich-text https://marmelab.com/react-admin/RichTextInput.html#calling-the-editor-object

{% raw %}
```tsx
import * as React from "react";
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from "react-admin";
import { DefaultEditorOptions, RichTextInput } from "ra-input-rich-text";
import { Button } from "ra-ui-materialui";
import { Editor } from "@tiptap/react";

const MyToolbar = ({ editorRef }) => (
  <Toolbar>
    <SaveButton />
    <Button
      onClick={() => {
        if (!editorRef.current) return;
        editorRef.current.commands.setContent("<h3>Template content</h3>"); // access the editor ref
      }}
    >
      Use template
    </Button>
  </Toolbar>
);

export const PostEdit = () => {
  const editorRef = React.useRef<Editor | null>(null);

  return (
    <Edit>
      <SimpleForm toolbar={<MyToolbar editorRef={editorRef} />}>
        <RichTextInput
          source="body"
          editorOptions={{
            ...DefaultEditorOptions,
            onCreate: ({ editor }: { editor: Editor }) => {
              editorRef.current = editor; // assign the editor ref
            },
          }}
        />
      </SimpleForm>
    </Edit>
  );
};
```
{% endraw %}

---

When users don’t find the reference they are looking for in the list of possible values, they need to create a new reference. Here's how you can let users create a new reference on the fly with `<ReferenceInput>`, `<AutocompleteInput onCreate>` and `useCreate`. #form #reference https://marmelab.com/react-admin/ReferenceInput.html#creating-a-new-reference

{% raw %}
```tsx
export const ContactEdit = () => {
    const [create] = useCreate();
    const notify = useNotify();
    const handleCreateCompany = async (companyName?: string) => {
        if (!companyName) return;
        try {
            const newCompany = await create(
                'companies',
                { data: { name: companyName } },
                { returnPromise: true }
            );
            return newCompany;
        } catch (error) {
            notify('An error occurred while creating the company', {
                type: 'error',
            });
            throw(error);
        }
    };
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="first_name" />
                <TextInput source="last_name" />
                <ReferenceInput source="company_id" reference="companies">
                    <AutocompleteInput onCreate={handleCreateCompany} />
                </ReferenceInput>
            </SimpleForm>
        </Edit>
    );
};
```
{% endraw %}

---

When you need to programmatically set form values, use the `useFormContext` hook from `react-hook-form`. #form #input https://react-hook-form.com/docs/useformcontext https://react-hook-form.com/docs/useform/setvalue

{% raw %}
```tsx
import { useFormContext } from 'react-hook-form';

export const ArticleInputs = () => {
    const { setValue } = useFormContext();

    return (
        <>
            <Button
                type="button"
                onClick={() => {
                    setValue('title', '');
                    setValue('description', '');
                }}
            >
                Reset
            </Button>
            <TextInput source="title" />
            <TextInput source="description" />
        </>
    );
};
```
{% endraw %}

---

Thanks to the react-admin community, you can find third-party react-admin components to enhance your apps, such as a color-picker, JSON fields and inputs, a trim field, a URL input, and more. Check the non-exhaustive list in [the third-party inputs documentation](https://marmelab.com/react-admin/Inputs.html#third-party-components).

---

The `notifictaion` prop of the `<Admin>` component allows you to customize the notification component. You can use the `Notification` component from the `react-admin` package to customize the notification content. #ui https://marmelab.com/react-admin/Admin.html#notification

{% raw %}
```tsx
import { Admin, Notification } from 'react-admin'; 
import { Slide } from '@mui/material';

const MyNotification = () => (
    <Notification
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        TransitionComponent={Slide}
        message="My custom notification"
    />
);

export const App = () => {
    return (
        <Admin notification={<MyNotification />}>
            {/*...*/}
        </Admin>
    );
};
```
{% endraw %}

---

The `useNotify` hook allows you to display notifications in your application. You can customize the notification content by passing a component directly to the `notify` method. #ui https://marmelab.com/react-admin/useNotify.html

{% raw %}
```tsx
import { useNotify } from 'react-admin';

const NotifyButton = () => {
    const notify = useNotify();
    const handleClick = () => {
        notify(
            <Alert severity="info">
                Comment approved
            </Alert>,
            { type: 'info' }
        );
    }
    return <button onClick={handleClick}>Notify</button>;
};
```
{% endraw %}

---

Throwing an `HttpError` in your `dataProvider` will have the effect to display a notification in your application. You can customize the content of the notification by passing a component directly to the `HttpError` method. #dataProvider https://marmelab.com/react-admin/DataProviderWriting.html#error-format

{% raw %}
```tsx
import { HttpError } from 'react-admin';
import { Alert, AlertTitle } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
export const MyDataProvider = {
    getList: (resource, params) => {
        return new Promise((resolve, reject) => {
            myApiClient(url, { ...options, headers: requestHeaders })
                .then(response =>
                    //...
                )
                .then(({ status, statusText, headers, body }) => {
                    let json;
                    try {
                        json = JSON.parse(body);
                    } catch (e) {
                        // not json, no big deal
                    }
                    if (status < 200 || status >= 300) {
                        return reject(
                            new HttpError(
                                (
                                    <Alert
                                        severity="error"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                        iconMapping={{
                                            error: (
                                                <ReportProblemOutlinedIcon />
                                            ),
                                        }}
                                    >
                                        <AlertTitle>
                                            An error has occured
                                        </AlertTitle>
                                        {(json && json.message) || statusText}
                                    </Alert>
                                ),
                                status,
                                json
                            )
                        );
                    }
                    //...
                });
        });
    },
    // ...
};
```
{% endraw %}

---

The `<Datagrid rowClick>` prop also accepts a function. This allows for more complex scenarios, like opening the 'edit' or 'show' view depending on whether or not a post accepts comments. #datagrid https://marmelab.com/react-admin/Datagrid.html#rowclick

{% raw %}
```tsx
import { List, Datagrid } from 'react-admin';

const rowClick = (_id, _resource, record) => {
    if (record.commentable) {
        return 'edit';
    }
    return 'show';
};

export const PostList = () => (
    <List>
        <Datagrid rowClick={rowClick}>
            ...
        </Datagrid>
    </List>
);
```
{% endraw %}

---

By default, the Dashboard page requires users to be authenticated and will redirect anonymous users to the login page. If you want to allow anonymous access to the dashboard, edit your `authProvider` to add an exception to the `checkAuth` method, as follows. #dashboard #authProvider https://marmelab.com/react-admin/Admin.html#dashboard

{% raw %}
```diff
const authProvider = {
    // ...
    checkAuth: (params) => {
+       if (params?.route === 'dashboard') return Promise.resolve();
        // ...
    },
}
```
{% endraw %}

---

When exporting the content of a list with the `<ExportButton>`, you may need to augment your objects based on relationships (e.g. comments should include the title of the related post). Fortunately, the `exporter` receives a `fetchRelatedRecords` function which helps fetch related records. #list https://marmelab.com/react-admin/List.html#exporter

{% raw %}
```tsx
// in CommentList.js
import { List, downloadCSV } from 'react-admin';
import type { FetchRelatedRecords } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = async (comments: Comments[], fetchRelatedRecords: FetchRelatedRecords) => {
    // will call dataProvider.getMany('posts', { ids: records.map(record => record.post_id) }),
    // ignoring duplicate and empty post_id
    const posts = await fetchRelatedRecords<Post>(comments, 'post_id', 'posts')
    const commentsWithPostTitle = comments.map(comment => ({
            ...comment,
            post_title: posts[comment.post_id].title,
    }));
    return jsonExport(commentsWithPostTitle, {
        headers: ['id', 'post_id', 'post_title', 'body'],
    }, (err, csv) => {
        downloadCSV(csv, 'comments');
    });
};

const CommentList = () => (
    <List exporter={exporter}>
        ...
    </List>
);
```
{% endraw %}

---

Should you need quick actions that update a record, you can leverage [the `<UpdateButton>` component](https://marmelab.com/react-admin/Buttons.html#updatebutton). It supports `undoable`, `optimistic` and `pessimistic` mutation modes and will even ask users for confirmation unless you chose the `undoable` mode.

{% raw %}
```tsx
import { Edit, SimpleForm, TextInput, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} />
    </TopToolbar>
);

export const PostEdit = () => (
    <Edit actions={<PostEditActions />}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

---

Sometimes you need to render a record property but it might cumbersome to build a component calling [the `useRecordContext` hook](https://marmelab.com/react-admin/useRecordContext.html). The `WithRecord` component might often be enough:

{% raw %}
```tsx
import { Show, SimpleShowLayout, WithRecord } from 'react-admin';

const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <WithRecord label="author" render={record => <span>{record.author}</span>} />
        </SimpleShowLayout>
    </Show>
);
```
{% endraw %}

---

After an upgrade of a react-admin package, you may encounter new bugs where a component cannot read a context created by another component. This is often caused by 2 conflicting versions of the same package in your dependencies. To fix such bugs, relax your npm dependencies (from `~` to `^`) and / or run [the `dedupe` command](https://docs.npmjs.com/cli/v9/commands/npm-dedupe) with you package manager.

```sh
$ npm dedupe
```

---

When displaying large pages of data, you might experience some performance issues. This is mostly due to the fact that we iterate over the `<Datagrid>` children and clone them.

In such cases, you can opt-in for an optimized version of the `<Datagrid>` by setting its optimized prop to true. Be aware that you can’t have dynamic children, such as those displayed or hidden by checking permissions, when using this mode.

```jsx
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid optimized>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```

---

Edition forms often contain linked inputs, e.g. country and city (the choices of the latter depending on the value of the former).

React-admin relies on react-hook-form for form handling. You can grab the current form values using react-hook-form’s useWatch hook.

{% raw %}

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

const CityInput = () => {
    const country = useWatch({ name: 'country' });
    return (
        <SelectInput
            choices={country ? toChoices(cities[country]) : []}
            source="cities"
        />
    );
};

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <SelectInput source="country" choices={toChoices(countries)} />
            <CityInput />
        </SimpleForm>
    </Edit>
);

export default OrderEdit;
```

{% endraw %}

---

When used inside a [`<ReferenceArrayInput>`](https://marmelab.com/react-admin/ReferenceArrayInput.html), whenever users type a string in the autocomplete input, `<AutocompleteArrayInput>` calls `dataProvider.getList()` using the string as filter, to return a filtered list of possible options from the reference resource. This filter is built using the `filterToQuery` prop.

By default, the filter is built using the `q` parameter. This means that if the user types the string ‘lorem’, the filter will be `{ q: 'lorem' }`.

You can customize the filter by setting the `filterToQuery` prop. It should be a function that returns a filter object.

{% raw %}

```tsx
const filterToQuery = searchText => ({ name_ilike: `%${searchText}%` });

<ReferenceArrayInput source="tag_ids" reference="tags">
    <AutocompleteArrayInput filterToQuery={filterToQuery} />
</ReferenceArrayInput>
```

{% endraw %}

---

You can choose to permanently filter the tree to display only a sub tree.

For instance, imagine you have one `employees` resource with a `department` field, and you want to display a tree for the Finance department. Use the `filter` prop to filter the tree:

{% raw %}

```jsx
const EmployeeList = () => <TreeWithDetails filter={{ department: 'finance' }} />;
```

{% endraw %}

**Note:** This only works if the filter field allows to extract a subtree with its own root node. If you use the `filter` prop to display a sparse selection of nodes (e.g. only the `male` employees), dragging nodes in this tree will not work as expected.

---

`react-hook-form` supports schema validation with many libraries through its [`resolver` props](https://react-hook-form.com/docs/useform#validationResolver).

To use schema validation, use the `resolver` prop following [react-hook-form’s resolvers documentation](https://github.com/react-hook-form/resolvers). Here’s an example using `yup`:

```tsx
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SimpleForm, TextInput, NumberInput } from 'react-admin';

const schema = yup
    .object()
    .shape({
        name: yup.string().required(),
        age: yup.number().required(),
    })
    .required();

const CustomerCreate = () => (
    <Create>
        <SimpleForm resolver={yupResolver(schema)}>
            <TextInput source="name" />
            <NumberInput source="age" />
        </SimpleForm>
    </Create>
);
```

---

If you are using `ra-data-simple-rest`, you can change the name of the content range header to be something else than the default `Content-Range`.
#dataProvider https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest#replacing-content-range-with-another-header

```jsx
const dataProvider =  simpleRestProvider('http://path.to.my.api/', undefined, 'X-Total-Count');
```

---

The `useUpdate` or `useCreate` hooks return `@tanstack/query` mutation callbacks, which cannot be awaited. If you wish to work with a Promise instead, you can use the `returnPromise` prop. This can be useful if the server changes the record, and you need the updated data to update another record.
#query #dataProvider https://marmelab.com/react-admin/useUpdate.html#returnpromise

{% raw %}

```tsx
const [update] = useUpdate(
    'posts',
    { id: record.id, data: { isPublished: true } },
    { returnPromise: true }
);
const [create] = useCreate('auditLogs');

const publishPost = async () => {
    try {
        const post = await update();
        create('auditLogs', { data: { action: 'publish', recordId: post.id, date: post.updatedAt } });
    } catch (error) {
        // handle error
    }
};
```

{% endraw %}

---
If you need to have custom pages to let your users sign-up, use the `<CustomRoutes>` component and set its `noLayout` prop. This ensures React-admin won't check whether users are authenticated. #router https://marmelab.com/react-admin/CustomRoutes.html

```jsx
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from "react-router-dom";

import dataProvider from './dataProvider';
import posts from './posts';
import comments from './comments';
import SignUp from './SignUp';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        <CustomRoutes noLayout>
            <Route path="/sign-up" element={<SignUp />} />
        </CustomRoutes>
    </Admin>
);

export default App;
```