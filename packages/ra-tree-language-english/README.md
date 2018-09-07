# English Messages for ra-tree

English messages for `ra-tree`, an addon providing tree components for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

## Installation

```sh
npm install --save ra-language-english ra-tree-language-english
```

## Usage

```js
import englishMessages from 'ra-language-english';
import treeEnglishMessages from 'ra-tree-language-english';
import { mergeTranslations } from 'react-admin';

const messages = {
    'en': mergeTranslations(englishMessages, treeEnglishMessages),
};

<Admin locale="en" messages={messages}>
  ...
</Admin>
```

## License

This translation is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
