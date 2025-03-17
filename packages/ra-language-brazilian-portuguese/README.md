# Brazilian Portuguese Messages for React-Admin

Brazilian Portuguese messages for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://www.youtube.com/watch?v=bJEo1O1oT6o)

## Installation

```sh
npm install --save ra-language-brazilian-portuguese
```

## Usage

```jsx
import { Admin } from 'react-admin';
import ptMessages from 'ra-language-brazilian-portuguese';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const messages = {
    'fr': ptMessages,
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale]);

<Admin locale="fr" i18nProvider={i18nProvider}>
    ...
</Admin>
```

## License

This translation is licensed under the MIT License, and sponsored by [marmelab](https://marmelab.com).
