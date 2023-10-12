---
layout: default
title: "The MarkdownInput Component"
---

# `<MarkdownInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to edit and preview Markdown data, based on [the Toast UI editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor).

<video controls autoplay playsinline muted loop>
  <source src="./img/markdown-input.webm" type="video/webm"/>
  <source src="./img/markdown-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

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
