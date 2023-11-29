---
layout: default
title: "Upgrading to v5"
---

# Upgrading to v5

## `<Datagrid rowClick>` is no longer `false` by default

`<Datagrid>` will now make the rows clickable as soon as a Show or Edit view is declared on the resource (using the [resource definition](https://marmelab.com/react-admin/Resource.html)).

If you previously relied on the fact that the rows were not clickable by default, you now need to explicitly disable the `rowClick` feature:

```diff
-<Datagrid>
+<Datagrid rowClick={false}>
   ...
</Datagrid>
```

## A `darkTheme` is now provided by default

If themes are not configured using the `<Admin>` component props, React-admin enables the [dark mode feature](https://marmelab.com/react-admin/AppTheme.html#light-and-dark-themes).

If you don't need the dark mode feature, you'll have to explicitly disable it:
```diff
-<Admin>
+<Admin darkTheme={null}>
   ...
</Admin>
```

Here are the priorities applied depending on whether the `theme` prop is provided or not:

- if `theme` is not provided, the [default light and dark theme](https://marmelab.com/react-admin/AppTheme.html#default) are used;
- if `theme` is provided the `lightTheme` prop is ignored (no change from before);
- if `theme` is provided and `darkTheme` prop is not, `darkTheme` is ignored and disabled;

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5. 