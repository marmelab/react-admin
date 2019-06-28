# German Messages for ra-tree

German messages for `ra-tree`, an addon providing tree components for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

## Installation

```sh
npm install --save ra-language-german ra-tree-language-german
```

## Usage

```js
import germanMessages from 'ra-language-german';
import treeGermanMessages from 'ra-tree-language-german';
import { mergeTranslations } from 'react-admin';

const messages = {
    'de': mergeTranslations(germanMessages, treeGermanMessages),
};

<Admin locale="de" messages={messages}>
  ...
</Admin>
```

## License

This translation is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
