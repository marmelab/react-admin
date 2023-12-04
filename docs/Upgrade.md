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

## Dark Theme Is Available By Default

In addition to the light theme, React-admin v5 includes a [dark theme](https://marmelab.com/react-admin/AppTheme.html#light-and-dark-themes), renders a theme switcher in the app bar, and chooses the default theme based on the user OS preferences. 

If you don't need the dark mode feature, you'll have to explicitly disable it:

```diff
-<Admin>
+<Admin darkTheme={null}>
   ...
</Admin>
```

If the `theme` prop is defined but not the `darkTheme` prop, theme switcher button in the app bar isn't displayed:

```diff
-<Admin>
+<Admin theme={myMainTheme}>
   ...
</Admin>
```

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5. 