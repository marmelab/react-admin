---
layout: default
title: "Upgrading to v5"
---

# Upgrading to v5

React-admin v5 has upgraded all its dependencies to their latest major version. Some major dependencies were swapped (`@tanstack/react-query` instead of `react-query`).

## `@tanstack/react-query` instead of `react-query`

We upgraded `react-query` to version 5. If you used some features directly from this library, you'll have to follow their migration guide for [v4](https://tanstack.com/query/v5/docs/react/guides/migrating-to-react-query-4) and [v5](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5). Here's a list of the most important things:

 - The package has been renamed to `@tanstack/react-query` so you'll have to change your imports:

    ```diff
    -import { useQuery } from 'react-query';
    +import { useQuery } from '@tanstack/react-query';
    ```

- `isLoading` has been renamed to `isPending`:

    ```diff
    import * as React from 'react';
    import { useUpdate, useRecordContext, Button } from 'react-admin';

    const ApproveButton = () => {
        const record = useRecordContext();
    -    const [approve, { isLoading }] = useUpdate('comments', { id: record.id, data: { isApproved: true }, previousData: record });
    +    const [approve, { isPending }] = useUpdate('comments', { id: record.id, data: { isApproved: true }, previousData: record });
    -    return <Button label="Approve" onClick={() => approve()} disabled={isLoading} />;
    +    return <Button label="Approve" onClick={() => approve()} disabled={isPending} />;
    };
    ```

    The following hooks are impacted by this change:

    - `useCreate`
    - `useDelete`
    - `useDeleteMany`
    - `useUpdate`
    - `useUpdateMany`
    - `useCreateController`
    - `useEditController`
    - `useDeleteWithUndoController`
    - `useDeleteWithConfirmController`

- All react-query hooks, `queryClient` and `queryCache` methods now accept a single object argument:

    ```diff
    - useQuery(key, fn, options)
    + useQuery({ queryKey, queryFn, ...options })
    - useInfiniteQuery(key, fn, options)
    + useInfiniteQuery({ queryKey, queryFn, ...options })
    - useMutation(fn, options)
    + useMutation({ mutationFn, ...options })
    - useIsFetching(key, filters)
    + useIsFetching({ queryKey, ...filters })
    - useIsMutating(key, filters)
    + useIsMutating({ mutationKey, ...filters })

    - queryClient.isFetching(key, filters)
    + queryClient.isFetching({ queryKey, ...filters })
    - queryClient.ensureQueryData(key, filters)
    + queryClient.ensureQueryData({ queryKey, ...filters })
    - queryClient.getQueriesData(key, filters)
    + queryClient.getQueriesData({ queryKey, ...filters })
    - queryClient.setQueriesData(key, updater, filters, options)
    + queryClient.setQueriesData({ queryKey, ...filters }, updater, options)
    - queryClient.removeQueries(key, filters)
    + queryClient.removeQueries({ queryKey, ...filters })
    - queryClient.resetQueries(key, filters, options)
    + queryClient.resetQueries({ queryKey, ...filters }, options)
    - queryClient.cancelQueries(key, filters, options)
    + queryClient.cancelQueries({ queryKey, ...filters }, options)
    - queryClient.invalidateQueries(key, filters, options)
    + queryClient.invalidateQueries({ queryKey, ...filters }, options)
    - queryClient.refetchQueries(key, filters, options)
    + queryClient.refetchQueries({ queryKey, ...filters }, options)
    - queryClient.fetchQuery(key, fn, options)
    + queryClient.fetchQuery({ queryKey, queryFn, ...options })
    - queryClient.prefetchQuery(key, fn, options)
    + queryClient.prefetchQuery({ queryKey, queryFn, ...options })
    - queryClient.fetchInfiniteQuery(key, fn, options)
    + queryClient.fetchInfiniteQuery({ queryKey, queryFn, ...options })
    - queryClient.prefetchInfiniteQuery(key, fn, options)
    + queryClient.prefetchInfiniteQuery({ queryKey, queryFn, ...options })

    - queryCache.find(key, filters)
    + queryCache.find({ queryKey, ...filters })
    - queryCache.findAll(key, filters)
    + queryCache.findAll({ queryKey, ...filters })
    ```

## Authentication hooks now return react-query hook result object directly

The `useAuthState`, `useIdentity` and `usePermissions` hooks no longer wrap the underlying react-query hook result and return it directly without adding anything.

```
-const { isLoading, authenticated } = useAuthState();
+const { isLoading, data: authenticated } = useAuthState();
-const { isLoading, identity } = useIdentity();
+const { isLoading, data: identity } = useIdentity();
-const { isLoading, permissions } = usePermissions();
+const { isLoading, data: permissions } = usePermissions();
```

## Removed deprecated hooks

The following deprecated hooks have been removed

- `usePermissionsOptimized`. Use `usePermissions` instead.

## `<Datagrid rowClick>` is no longer `false` by default

`<Datagrid>` will now make the rows clickable as soon as a Show or Edit view is declared on the resource (using the [resource definition](https://marmelab.com/react-admin/Resource.html)).

If you previously relied on the fact that the rows were not clickable by default, you now need to explicitly disable the `rowClick` feature:

```diff
-<Datagrid>
+<Datagrid rowClick={false}>
   ...
</Datagrid>
```

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5. 
