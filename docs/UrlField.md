---
layout: default
title: "The UrlField Component"
storybook_path: ra-ui-materialui-fields-urlfield--basic
---

# `<UrlField>`

`<UrlField>` displays a url in a Material UI's `<Link href="" />` component.

```jsx
import { UrlField } from 'react-admin';

<UrlField source="site_url" />
```

## `content`

You can customize the content of the link by passing a string as the `content` prop.

```jsx
import { UrlField } from 'react-admin';

<UrlField source="site_url" content="Visit site" />
```
