---
layout: default
title: "Translation"
---

# Translation

Admin-on-rest uses English as the default language. But it also supports another ones thanks to [polyglot.js](http://airbnb.io/polyglot.js/) library which is included. Visit [marmelab/admin-on-rest](https://github.com/marmelab/admin-on-rest/tree/master/src/i18n) for a list of all supported languages. And, in case it doesn't support your own language, feel free to submit a pull request.

To handle translations, `Admin` component has two props: `messages` and `locale`. The first one is a dictionnary mapping locale codes (`fr`, `de`, and so on) to translation tree (ie `{ list: { buttons: { add: 'Add' } }`). Which value of the root dictionnary is determined by the `locale` property.

## Using browser locale

English is used as default (and fallback) locale for translations, but it is also possible to use another locale as long as the corresponding translation is available with it.

Admin-on-rest provide an helper function named `resolveBrowserLocale` which help you to introduce a dynamic locale attribution from the locale configured on the browser. To use it, simply use it as locale prop argument.

```js
import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'admin-on-rest';

const App = () => (
    <Admin ...(your props) locale={resolveBrowserLocale()}>
        (...)
    </Admin>
);

export default App;

```

## Deal with Existing Translations

All translations are in `aor` namespace to prevent collisions with your own custom translations.

To override an existing translation, simply provide an object to the `messages` props of the admin, with the locale you want to cover as root key and a nested object to the wanted translation(s).

```js
import React from 'react';
import { Admin, Resource } from 'admin-on-rest';

const messages = {
    en: {
        aor: {
            action: {
                delete: 'Remove',
            },
        },
    },
};

const App = () => (
    <Admin ...(your props) messages={messages}>
        (...)
    </Admin>
);

export default App;

```

## Translate your own components

The translation system use context to provide translations through the react component tree. To translate a component you must "map" the context "translate" function to the wanted component props. To do this, it is enough simply to use an HOC who is named "Translate" on your component. Of course, we assumes that you've previously add the corresponding translation to the `messages` props of the `Admin` component.

```js
import React from 'react';
import { Translate } from 'admin-on-rest';

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);

export default Translate(MyHelloButton);

```

## Using specific polyglot features

Polyglot.js is a fantastic library, in addition to being small, fully maintened and totaly agnostic, it provide some pretty features as interpolation and pluralization that you can use now in Admin-on-rest.

```js

const messages = {
    'hello_name': 'Hello, %{name}',
    'count_beer': '%{count} beer |||| %{count} beers',
}

// Interpolation example

translate('hello_name', { name: 'John Doe' });
=> "Hello, John Doe."

// Pluralization example

translate('count_beer', { count: 1 });
=> "1 beer"

translate('count_beer', { count: 2 });
=> "2 beers"

```

To find more detailed examples, please refer to [http://airbnb.io/polyglot.js/](http://airbnb.io/polyglot.js/)
