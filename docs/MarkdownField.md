---
layout: default
title: "The MarkdownField Component"
---

# `<MarkdownField>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to render Markdown data as HTML.

![MarkdownField preview](https://marmelab.com/ra-enterprise/modules/assets/ra-markdown/latest/markdown-field-preview.png)

```jsx
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { MarkdownField } from '@react-admin/ra-markdown';

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <MarkdownField source="description" />
        </SimpleShowLayout>
    </Show>
);
```

**Tip**: If you want to display raw (unformatted) markdown, use `<TextField component="pre">` instead:

```tsx
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="description" component="pre" />
        </SimpleShowLayout>
    </Show>
);
```

Check [the `ra-markdown` documentation](https://marmelab.com/ra-enterprise/modules/ra-markdown) for more details.
