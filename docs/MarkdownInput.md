---
layout: default
title: "The MarkdownInput Component"
---

# `<MarkdownInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to edit and preview Markdown data, based on [the Toast UI editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor).

![MarkdownInput](./img/markdown-input.gif)

```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { MarkdownInput } from '@react-admin/ra-markdown';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <MarkdownInput source="description" />
        </SimpleForm>
    </Edit>
);
```

Check [the `ra-markdown` documentation](https://marmelab.com/ra-enterprise/modules/ra-markdown) for more details.
