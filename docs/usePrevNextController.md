---
layout: default
title: "usePrevNextController"
---

# `usePrevNextController`

`useShowController` fetche previous and next record IDs for a given record and resource.

It fetches the list of records from the REST API according to the filters and the sort order of listsfrom the store and also merges the filters and the sorting order passed into props.

It used by `<PrevNextButtons>` to render a navigation to move to the next or previous record of a resource.

`useShowController` can be used anywhere a record context is provided (eg: often inside a `<Show>` or `<Edit>` component).

## Usage

{% raw %}
```tsx
// in src/MyPrevNextButtons.tsx
import * as React from 'react';
import {
    RaRecord,
    useTranslate,
    usePrevNextController,
    UsePrevNextControllerProps,
} from 'ra-core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router-dom';
import { CircularProgress, IconButton, SxProps, styled } from '@mui/material';
import clsx from 'clsx';

export const MyPrevNextButtons = <RecordType extends RaRecord = any>(
    props: PrevNextButtonProps<RecordType>
) => {
    const { sx } = props;

    const {
        hasPrev,
        hasNext,
        navigateToNext,
        navigateToPrev,
        index,
        total,
        error,
        isLoading,
    } = usePrevNextController<RecordType>(props);

    const translate = useTranslate();

    if (isLoading) {
        return <CircularProgress size={14} />;
    }
    if (error) {
        return (
            <ErrorOutlineIcon
                color="error"
                fontSize="small"
                titleAccess="error"
                aria-errormessage={error.message}
            />
        );
    }

    return (
        <nav>
            <ul className={clsx(PrevNextButtonClasses.list)}>
                <li>
                    <IconButton
                        component={hasPrev ? Link : undefined}
                        to={navigateToPrev}
                        aria-label={translate('ra.navigation.previous')}
                        disabled={!hasPrev}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </li>
                {typeof index === 'number' && (
                    <li>
                        {index + 1} / {total}
                    </li>
                )}
                <li>
                    <IconButton
                        component={hasNext ? Link : undefined}
                        to={navigateToNext}
                        aria-label={translate('ra.navigation.next')}
                        disabled={!hasNext}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </li>
            </ul>
        </nav>
    );
};

interface MyPrevNextButtonProps<RecordType extends RaRecord = any> extends UsePrevNextControllerProps<RecordType> 
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

## `filter`

Just like [Permanent `filter` in `<List>`](./List.md#filter-permanent-filter), you can specify what filter to apply to fetches the list of records.

## `limit`

You can set the maximum number of records to fetch with `limit` prop. By default, `usePrevNextController` fetches a maximum of `1000` records.

## `linkType`

By default `<usePrevNextController>` generates links to `<Edit>` view. You can also set the `linkType` prop to `show` to link to the `<Show>` view instead.

`linkType` accepts the following values:

* `linkType="edit"`: links to the edit page. This is the default behavior.
* `linkType="show"`: links to the show page.

## `queryOptions`

`usePrevNextController` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getList()` call.

## `resource`

By default, `usePrevNextController` operates on the current `ResourceContext` (defined at the routing level), so under the `/customers` path, the `resource` prop will be `customers`. You may want to force a different resource to fetche. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

## `sort`

Pass an object literal as the `sort` prop to determine `field` and `order` used for sorting:

## `storeKey`

`usePrevNextController` grabs list parameters (sort and filters) from the store.
This prop is useful if you specified a custom `storeKey` for a `<List>` and you want `usePrevNextController` grabs the same stored parmaters.
See [`storeKey` in `<List>`](./List.md#storekey) for more informations. 