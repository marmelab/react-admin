---
layout: default
title: "The PrevNextButtons Component"
---

# `<PrevNextButtons>`

The `<PrevNextButtons>` component renders navigation buttons linking to the next or previous record of a resource. It also renders the current index and the total number of records.

<video controls autoplay playsinline muted loop>
  <source src="./img/prev-next-buttons.webm" type="video/webm" />
  <source src="./img/prev-next-buttons.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

`<PrevNextButtons>` can be used anywhere a [`RecordContext`](./Architecture.md#context-pull-dont-push) is provided (e.g. in an [Edit](./Edit.md) or [Show](./Show.md) view).

## Usage

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

## Props

| Prop           | Required | Type             | Default                             | Description                                                                                 |
| -------------- | -------- | ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `filter`       | Optional | `object`         | `{}`                                | The permanent filter values.                                                                |
| `filter DefaultValues` | Optional | `object`  | `{}`                                | The default filter values.                                                                |
| `limit`        | Optional | `number`         | `1000`                              | Maximum number of records to fetch.                                                         |
| `linkType`     | Optional | `string`         | 'edit'                              | Specifies the view to redirect to when navigating.                                          |
| `queryOptions` | Optional | `object`         | `{ staleTime: 5 * 60 * 1000 }`      | The options to pass to the useQuery hook.                                                   |
| `resource`     | Optional | `string`         | -                                   | The resource name, e.g. `customers`.                                                        |
| `sort`         | Optional | `object`         | `{ field: 'id', order: SORT_ASC } ` | The sort parameters.                                                                |
| `storeKey`     | Optional | `string | false` | -                                   | The key to use to match a filter & sort configuration of a `<List>`. Pass false to disable. |
| `sx`           | Optional | `object`         | -                                   | The CSS styles to apply to the component. |

## `filter`

Just like [Permanent `filter` in `<List>`](./List.md#filter-permanent-filter), you can specify a filter always applied when fetching the list of records.

{% raw %}
```jsx
export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons filter={{ city: 'Hill Valley' }} />
            </TopToolbar>
        }
    >
    ...
    </Edit>
);
```
{% endraw %}

For example, this prop is useful to set the same `filter` as the `<List>` for the same resource:

{% raw %}
```tsx
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
        />
    </Admin>
);
```
{% endraw %}

## `filterDefaultValues`

To use a default filter value, set the `filterDefaultValues` prop. 

{% raw %}
```jsx
export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons filterDefaultValues={{ city: 'Hill Valley' }} />
            </TopToolbar>
        }
    >
    ...
    </Edit>
);
```
{% endraw %}

This prop is useful to set the same default filter as the `<List>` for the same resource:

{% raw %}
```tsx
export const MyAdmin = () => (
    <Admin>
        <Resource
            name="customers"
            list={
                <List filterDefaultValues={{ city: 'Hill Valley' }}>
                ...
                </List>
            }
            edit={
                <Edit
                    actions={
                        <TopToolbar>
                            <PrevNextButtons filterDefaultValues={{ city: 'Hill Valley' }} />
                        </TopToolbar>
                    }
                >
                ...
                </Edit>
            }
        />
    </Admin>
);
```
{% endraw %}

## `limit`

You can set the maximum number of records to fetch with the `limit` prop. By default, `usePrevNextController` fetches a maximum of `1000` records.

```jsx
export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons limit={500}/>
            </TopToolbar>
        }
    >
    ...
    </Edit>
);
```

## `linkType`

By default `<PrevNextButtons>` items link to the `<Edit>` view. You can also set the `linkType` prop to `show` to link to the `<Show>` view instead.


```tsx
export const CustomerShow = () => (
    <Show
        actions={
            <TopToolbar>
                <PrevNextButtons linkType="show" />
            </TopToolbar>
        }
    >
    ...
    </Show>
);
```

`linkType` accepts the following values:

* `linkType="edit"`: links to the edit page. This is the default behavior.
* `linkType="show"`: links to the show page.

## `queryOptions`

`<PrevNextButtons>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getList()` call.

{% raw %}
```tsx
export const CustomerShow = () => (
    <Show
        actions={
            <TopToolbar>
                <PrevNextButtons linkType="show" queryOptions={{ meta: { foo: 'bar' } }} />
            </TopToolbar>
        }
    >
    ...
    </Show>
);
```
{% endraw %}

## `resource`

By default, `<PrevNextButtons>` operates on the current `ResourceContext` (defined at the routing level), so under the `/customers` path, the `resource` prop will be `customers`. Pass a custom `resource` prop to override the `ResourceContext` value.

```jsx
export const CustomerEdit = () => (
    <Edit
        actions={
            <TopToolbar>
                <PrevNextButtons resource="users"/>
            </TopToolbar>
        }
    >
    ...
    </Edit>
);
```

## `sort`

Pass an object literal as the `sort` prop to set the `field` and `order` used for sorting:

{% raw %}
```jsx
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
    ...
    </Edit>
);
```
{% endraw %}

For example, this prop is useful to set the same `filter` as the `<List>` view which handle the same resource:

{% raw %}
```tsx
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
        />
    </Admin>
);
```
{% endraw %}

## `storeKey`

`<PrevNextButtons>` can get the current list parameters (sort and filters) from the store.
This prop is useful if you specified a custom `storeKey` for a `<List>` and you want `<PrevNextButtons>` to use the same stored parameters.

See [`storeKey` in `<List>`](./List.md#storekey) for more information. 

```tsx
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
        />
    </Admin>
);
```

## `sx`

The `<PrevNextButtons>` component accepts the usual `className` prop, but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasse:

| Rule name                  | Description                      |
| -------------------------- | -------------------------------- |
| `& .RaPrevNextButton-list` | Applied to the list container |

Here is an example:

{% raw %}
```tsx
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
    ...
    </Show>
);
```
{% endraw %}

## Navigating Through Records In `<Edit>` Views After Submit

Let's say users want to edit customer records and to navigate between records in the `<Edit>` view. The default react-admin behaviors causes two problems: 
- when they save a record the user is redirected to the `<List>` view,
- when they navigate to another record, the form is not saved.

Thanks to React-admin components, you can solve these issues by using 
- [`redirect` prop from `<Edit>`](./Edit.md#redirect) with which you can specify the redirect to apply. Here we will choose to stay on the page rather than being redirected to the list view.
- [`warnWhenUnsavedChanges` from `Form`](./Form.md#warnwhenunsavedchanges) that will trigger an alert if the user tries to change page while the record has not been saved.

{% raw %}
```tsx
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

## Performance

This component tries to avoid fetching the API to determine the previous and next item link. It does so by inspecting the cache of the list view. If the user has already rendered the list view for the current resource, `<PrevNextButtons>` will not need to call the `dataProvider` at all. 

However, if the user has never displayed a list view, or if the current record is outside of the boundaries of the list view cache, `<PrevNextButtons>` will have to **fetch the entire list of records** for the current resource to determine the previous and next item link. This can be costly in terms of server and network performance. 

If this is a problem, use [the `limit` prop](#limit) to limit the number of records fetched from the API. You can also pass a `meta` parameter to select only the `id` field in the records.
