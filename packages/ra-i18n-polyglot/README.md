# Polyglot i18n provider for react-admin

Polyglot i18n provider for [react-admin](https://github.com/marmelab/react-admin), the frontend framework for building admin applications on top of REST/GraphQL services. It relies on [polyglot.js](https://airbnb.io/polyglot.js/), which uses JSON files for translations.

[![react-admin-demo](https://marmelab.com/react-admin/img/react-admin-demo-still.png)](https://vimeo.com/268958716)

## Installation

```sh
npm install --save ra-i18n-polyglot
```

## Usage

Wrap the function exported by this package around a function returning translation messages based on a locale to produce a valid `i18nProvider`.

```jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};

const i18nProvider = polyglotI18nProvider(locale => messages[locale]);

const App = () => (
    <Admin locale="en" i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

## Translation Messages

The `message` returned by the function argument should be a dictionary where the keys identify interface components, and values are the translated string. This dictionary is a simple JavaScript object looking like the following:

```js
{
    ra: {
        action: {
            delete: 'Delete',
            show: 'Show',
            list: 'List',
            save: 'Save',
            create: 'Create',
            edit: 'Edit',
            cancel: 'Cancel',
        },
        ...
    },
}
```

All core translations are in the `ra` namespace, in order to prevent collisions with your own custom translations. The root key used at runtime is determined by the value of the `locale` prop.

The default messages are available [here](https://github.com/marmelab/react-admin/blob/master/packages/ra-language-english/src/index.ts).

## Asynchronous Locale Change

The function passed as parameter of `polyglotI18nProvider` can return a *Promise* for messages instead of a messages object. This lets you lazy load messages upon language change.

Note that the messages for the default locale (used by react-admin for the initial render) must be returned in a synchronous way. 

```jsx
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

const asyncMessages = {
    fr: () => import('ra-language-french').then(messages => messages.default),
    it: () => import('ra-language-italian').then(messages => messages.default),
};

const messagesResolver = locale => {
    if (locale === 'en') {
        // initial call, must return synchronously
        return englishMessages;
    }
    // change of locale after initial call returns a promise
    return asyncMessages[params.locale]();
}

const i18nProvider = polyglotI18nProvider(messagesResolver);
```

## Using Specific Polyglot Features

Polyglot.js is a fantastic library: in addition to being small, fully maintained, and totally framework agnostic, it provides some nice features such as interpolation and pluralization, that you can use in react-admin.

```js
const messages = {
    'hello_name': 'Hello, %{name}',
    'count_beer': 'One beer |||| %{smart_count} beers',
};

// interpolation
translate('hello_name', { name: 'John Doe' });
=> 'Hello, John Doe.'

// pluralization
translate('count_beer', { smart_count: 1 });
=> 'One beer'

translate('count_beer', { smart_count: 2 });
=> '2 beers'

// default value
translate('not_yet_translated', { _: 'Default translation' });
=> 'Default translation'
```

To find more detailed examples, please refer to [http://airbnb.io/polyglot.js/](https://airbnb.io/polyglot.js/)
