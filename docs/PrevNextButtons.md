---
layout: default
title: "The PrevNextButtons Component"
---

# `<PrevNextButtons>`

A component used to render a previous and a next buttons in a [`RecordContext`](./Architecture.md#context-pull-dont-push).

The `<PrevNextButtons>` component render a navigation to move to the next or previous record of a resource, in an [Edit](./Edit.md) or [Show](./Show.md) view. It renders also the current index and the total number of records.

<video controls autoplay playsinline muted loop>
  <source src="./img/prev-next-buttons.webm" type="video/webm" />
  <source src="./img/prev-next-buttons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

It uses `usePrevNextController` to fetches the list of records.

`<PrevNextButtons>` can be used anywhere a record context is provided (eg: often inside a `<Show>` or `<Edit>` component).

## Usage

{% raw %}
```tsx
// in src/CustomerEdit.tsx
import { Edit, PrevNextButtons, ShowButton, SimpleForm, TextInput, TopToolbar } from 'react-admin';

export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons />
                <ShowButton />
            </TopToolbar>
        }
    >
        <SimpleForm> 
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="email" />
            <TextInput source="city" />
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

## Props

| Prop           | Required | Type             | Default                             | Description                                                                                 |
| -------------- | -------- | ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `filter`       | Optional | `object`         | `{}`                                | The permanent filter values.                                                                |
| `limit`        | Optional | `number`         | `1000`                              | Maximum number of records to fetch.                                                         |
| `linkType`     | Optional | `string`         | 'edit'                              | Specifies the view to redirect to when navigating.                                          |
| `queryOptions` | Optional | `object`         | `{ staleTime: 5 * 60 * 1000 }`      | The options to pass to the useQuery hook.                                                   |
| `resource`     | Optional | `string`         | -                                   | The resource name, e.g. `customers`.                                                        |
| `sort`         | Optional | `object`         | `{ field: 'id', order: SORT_ASC } ` | The initial sort parameters.                                                                |
| `storeKey`     | Optional | `string | false` | -                                   | The key to use to match a filter & sort configuration of a `<List>`. Pass false to disable. |
| `sx`           | Optional | `object`         | -                                   | The CSS styles to apply to the component. |

## `filter`

Just like [Permanent `filter` in `<List>`](./List.md#filter-permanent-filter), you can specify what filter to apply to fetches the list of records.

{% raw %}
```jsx
// in src/CustomerEdit.tsx
import { Edit, PrevNextButtons,, SimpleForm, TopToolbar } from 'react-admin';

export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons filter={{ city: 'Hill Valley' }} />
            </TopToolbar>
        }
    >
        <SimpleForm > 
           ...
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

For example, this prop is useful to grab the same `filter` from the `<List>` view which handle the same resource:

{% raw %}
```tsx
import * as React from 'react';
import { Admin, Edit, List, PrevNextButtons, Resource, Show, TopToolbar } from 'react-admin';

export const MyAdmin = () => (
    <Admin>
        <Resource
            name="customers"
            list={
                <List filter={{ city: 'Hill Valley' }}>
                    ...
                </List>
            }
            edit={
                <Edit
                    actions={
                        <TopToolbar>
                            <PrevNextButtons filter={{ city: 'Hill Valley' }} />
                        </TopToolbar>
                    }
                >
                    ...
                </Edit>
            }
            show={
                <Show
                    actions={
                        <TopToolbar>
                            <PrevNextButtons
                                linkType="show"
                                filter={{ city: 'Hill Valley' }}
                            />
                        </TopToolbar>
                    }
                >
                    ...
                </Show>
            }
        />
    </Admin>
);
```
{% endraw %}

## `limit`

You can set the maximum number of records to fetch with `limit` prop. By default, `usePrevNextController` fetches a maximum of `1000` records.

```jsx
// in src/CustomerEdit.tsx
import { Edit, PrevNextButtons,, SimpleForm, TopToolbar } from 'react-admin';

export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons limit={500}/>
            </TopToolbar>
        }
    >
        <SimpleForm > 
           ...
        </SimpleForm>
    </Edit>
);
```

## `linkType`

By default `<PrevNextButtons>` items link to `<Edit>` view. You can also set the `linkType` prop to `show` to link to the `<Show>` view instead.

{% raw %}
```tsx
// in src/CustomerShow.tsx
import { Show, PrevNextButtons, SimpleShowLayout, TopToolbar } from 'react-admin';

export const CustomerShow = () => (
    <Show
        actions={
            <TopToolbar>
                <PrevNextButtons linkType="show" />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
           ...
        </SimpleShowLayout>
    </Show>
);
```
{% endraw %}

`linkType` accepts the following values:

* `linkType="edit"`: links to the edit page. This is the default behavior.
* `linkType="show"`: links to the show page.

## `queryOptions`

`<PrevNextButtons>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getList()` call.

{% raw %}
```tsx
// in src/CustomerShow.tsx
import { Show, PrevNextButtons, SimpleShowLayout, TopToolbar } from 'react-admin';

export const CustomerShow = () => (
    <Show
        actions={
            <TopToolbar>
                <PrevNextButtons linkType="show" queryOptions={{ meta: { foo: 'bar' } }} />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
           ...
        </SimpleShowLayout>
    </Show>
);
```
{% endraw %}

## `resource`

By default, `<PrevNextButtons>` operates on the current `ResourceContext` (defined at the routing level), so under the `/customers` path, the `resource` prop will be `customers`. You may want to force a different resource to fetche. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
// in src/CustomerEdit.tsx
import { Edit, PrevNextButtons,, SimpleForm, TopToolbar } from 'react-admin';

export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons resource="users"/>
            </TopToolbar>
        }
    >
        <SimpleForm > 
           ...
        </SimpleForm>
    </Edit>
);
```

## `sort`

Pass an object literal as the `sort` prop to determine `field` and `order` used for sorting:

{% raw %}
```jsx
// in src/CustomerEdit.tsx
import { Edit, PrevNextButtons,, SimpleForm, TopToolbar } from 'react-admin';

export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons sort={{
                    field: 'first_name',
                    order: 'DESC',
                }}/>
            </TopToolbar>
        }
    >
        <SimpleForm > 
           ...
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

For example, this prop is useful to grab the same `filter` from the `<List>` view which handle the same resource:

{% raw %}
```tsx
import * as React from 'react';
import { Admin, Edit, List, PrevNextButtons, Resource, Show, TopToolbar } from 'react-admin';

export const MyAdmin = () => (
    <Admin>
        <Resource
            name="customers"
            list={
                <List sort={{
                    field: 'first_name',
                    order: 'DESC',
                }}>
                    ...
                </List>
            }
            edit={
                <Edit
                    actions={
                        <TopToolbar>
                            <PrevNextButtons sort={{
                                field: 'first_name',
                                order: 'DESC',
                            }} />
                        </TopToolbar>
                    }
                >
                    ...
                </Edit>
            }
            show={
                <Show
                    actions={
                        <TopToolbar>
                            <PrevNextButtons
                                linkType="show"
                                sort={{
                                    field: 'first_name',
                                    order: 'DESC',
                                }}
                            />
                        </TopToolbar>
                    }
                >
                    ...
                </Show>
            }
        />
    </Admin>
);
```
{% endraw %}

## `storeKey`

Thanks to `usePrevNextController`, `<PrevNextButtons>` grabs list parameters (sort and filters) from the store.
This prop is useful if you specified a custom `storeKey` for a `<List>` and you want `<PrevNextButtons>` grabs the same stored parmaters.
See [`storeKey` in `<List>`](./List.md#storekey) for more informations. 

```tsx
import * as React from 'react';
import { Admin, Edit, List, PrevNextButtons, Resource, Show, TopToolbar } from 'react-admin';

export const MyAdmin = () => (
    <Admin>
        <Resource
            name="customers"
            list={
                <List storeKey="customers_key">
                    ...
                </List>
            }
            edit={
                <Edit
                    actions={
                        <TopToolbar>
                            <PrevNextButtons storeKey="customers_key" />
                        </TopToolbar>
                    }
                >
                    ...
                </Edit>
            }
            show={
                <Show
                    actions={
                        <TopToolbar>
                            <PrevNextButtons
                                linkType="show"
                                storeKey="customers_key"
                            />
                        </TopToolbar>
                    }
                >
                    ...
                </Show>
            }
        />
    </Admin>
);
```

## `sx`

The `<PrevNextButtons>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasse:

| Rule name                  | Description                      |
| -------------------------- | -------------------------------- |
| `& .RaPrevNextButton-list` | Applied to the list container |

Here is an example:

{% raw %}
```tsx
// in src/CustomerShow.tsx
import { Show, PrevNextButtons, SimpleShowLayout, TopToolbar } from 'react-admin';

export const CustomerShow = () => (
    <Show
        actions={
            <TopToolbar>
                <PrevNextButtons
                    linkType="show"
                    sx={{
                        color: 'blue',
                        '& .RaPrevNextButton-list': {
                            padding: '10px',
                        },
                    }}
                />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
           ...
        </SimpleShowLayout>
    </Show>
);
```
{% endraw %}

## Navigate across `<Edit>` views

Let's says the user wants to edit customer records and he wants to navigate accross these by staying in the `<Edit>` view. The problems: 
- when their save a record the user is redirected to the `<List>` view,
- when their navigate accross records, the form is not saved.

Thanks to React-admin components, you can solve these issues by using [`redirect` prop from `<Edit>`](Edit.md#redirect) component and [`warnWhenUnsavedChanges` from `Form`](Form.md#warnwhenunsavedchanges).

{% raw %}
```tsx
// in src/CustomerEdit.tsx
import { Edit, PrevNextButtons, SimpleForm, TopToolbar } from 'react-admin';

export const CustomerEdit = () => (
    <Edit
        redirect={false}
        actions={
            <TopToolbar>
                <PrevNextButtons />
            </TopToolbar>
        }
    >
        <SimpleForm warnWhenUnsavedChanges> 
           ...
        </SimpleForm>
    </Edit>
);
```
{% endraw %}