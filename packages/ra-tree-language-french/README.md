# French Messages for ra-tree

French messages for `ra-tree`, an addon providing tree components for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

## Installation

```sh
npm install --save ra-language-french ra-tree-language-french
```

## Usage

```js
import englishMessages from 'ra-language-french';
import treeFrenchMessages from 'ra-tree-language-french';
import { mergeTranslations } from 'react-admin';

const messages = {
    'fr': mergeTranslations(frenchMessages, treeFrenchMessages),
};

<Admin locale="fr" messages={messages}>
  ...
</Admin>
```

## License

This translation is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
