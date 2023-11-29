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

## Links are now underlined by default
 
In the default theme, links are now underlined by default. 

If you use the `<Link>` component from `react-admin`, and you want to remove the underline, set the `underline` prop to `none`:

```diff
import { Link } from 'react-admin';

const MyComponent = () => (
-   <Link to="/foo">Foo</Link>
+   <Link to="/foo" underline="none">Foo</Link>
);
```

If you use a react-admin component that uses `<Link>` under the hood, like `<ReferenceField>`, and you want to remove the underline, use the `sx` prop:

{% raw %}
```diff
const CompanyField = () => (
-   <ReferenceField source="company_id" reference="companies" />
+   <ReferenceField source="company_id" reference="companies" sx={{
+      '& a': { textDecoration: 'none' }
+   }} />
)
```
{% endraw %}

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5. 