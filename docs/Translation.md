---
layout: default
title: "Translation"
---

# Translation

The admin-on-rest interface uses English as the default language. But it also supports any other language, thanks to the [polyglot.js](http://airbnb.io/polyglot.js/) library.

## Changing Locale

To handle translations, the `<Admin>` component supports:

- a `locale` prop expecting a string ('en', 'fr', etc), and
- a `messages` prop, expecting a dictionary object.

Admin-on-rest only ships the English locale; if you want to use another locale, you'll have to install a third-party package. For instance, to change the interface to French, install the `aor-language-french` npm package, then configure the `<Admin>` component as follows:

```js
import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'admin-on-rest';
import frenchMessages from 'aor-language-french';

const messages = {
    fr: frenchMessages,
};

const App = () => (
    <Admin ...(your props) locale="fr" messages={messages}>
        ...
    </Admin>
);

export default App;
```

You can find translation packages for the following languages:

- English (`en`) is the default
- [French (`fr`)](https://github.com/marmelab/aor-language-french)

If you want to contribute a new translation, feel free to submit a pull request to update [this page](https://github.com/marmelab/admin-on-rest/blob/master/docs/Translation.md) with a link to your package.

## Using The Browser Locale

It is also possible to use another locale, as long as the corresponding translation is available with it.

Admin-on-rest provides a helper function named `resolveBrowserLocale()`, which helps you to introduce a dynamic locale attribution based on the locale configured in the user's browser. To use it, simply pass the function as `locale` prop.

```js
import React from 'react';
import { Admin, Resource, englishMessages, resolveBrowserLocale } from 'admin-on-rest';
import frenchMessages from 'aor-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};

const App = () => (
    <Admin ...(your props) locale={resolveBrowserLocale()} messages={messages}>
        ...
    </Admin>
);

export default App;
```

## Translation Messages

The `message` value should be a dictionary where keys are identifiers of interface components, and values are the translated string. This dictionary is a simple JavaScript object looking like the following:

```js
{
    en: {
        aor: {
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
    },
    fr: {
        aor: {
            action: {
                delete: 'Supprimer',
                show: 'Afficher',
                list: 'Liste',
                save: 'Enregistrer',
                create: 'Créer',
                edit: 'Éditer',
                cancel: 'Quitter',
            },
            ...
        }
    }
}
```

All core translations are in the `aor` namespace, in order to prevent collisions with your own custom translations. The root key used for the interface is determined by the `locale` property.

## Overriding Existing Translations

To override an existing translation, simply provide a `messages` props to the `<Admin>` component, with the locale you want to cover as root key, and a nested object of the wanted translation(s). Admin-on-rest will merge this object with its default translations.

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
        ...
    </Admin>
);

export default App;
```

If you want to handle multiple languages *and* override the default translations, use the following approach:

```js
// default translations
import { englishMessages } from 'admin-on-rest';
import frenchMessages from 'aor-language-french';

// your custom messages
import * as customMessages from './i18n';

const messages = {
    fr: { ...frenchMessages, ...customMessages.fr },
    en: { ...englishMessages, ...customMessages.en },
};

const App = () => (
    <Admin ...(your props) messages={messages}>
        ...
    </Admin>
);
```

## Translating Your Resources

By default, Admin-on-rest uses resource names ("post", "comment", etc) everywhere in the interface, without taking into account the current user locale.

To translate resource names in page titles, you must add them to the `messages` dictionary, under the special `resource` key. After what, it will be automatically translated at runtime if resource names match.

For example, if you want to translate a "shoe" resource, you must add the following object to the `messages` dictionary:

```js

{
    en: {
        resources: {
            shoe: {
                name: 'Shoe |||| Shoes',
            },
        }
    },
    fr: {
        resources: {
            shoe: {
                name: 'Chaussure |||| Chaussures',
            },
        }
    }
}

```

As you can see, [polyglot pluralization](http://airbnb.io/polyglot.js/#pluralization) is used here, but it is optional.

## Translating Your Own Components

The translation system use the React context to pass translations down the component tree. To translate a sentence, use the `translate` function from the context. Of course, this assumes that you've previously added the corresponding translation to the `messages` props of the `Admin` component.

```js
// in src/MyHelloButton.js
import React, { Component, PropTypes } from 'react';

class MyHelloButton {
    render() {
        const { translate } = this.context;
        return <button>{translate('myroot.hello.world')}</button>;
    }
}
MyHelloButton.contextTypes = {
    translate: PropTypes.function,
};

// in src/App.js
const messages = {
    en: {
        myroot: {
            hello: {
                world: 'Hello, World!',
            },
        },
    },
};
```

However, using the context makes components harder to test. That's why admin-on-rest provides a `Translate` HOC, which simply passes the `translate` function from context to props:

```js
// in src/MyHelloButton.js
import React from 'react';
import { Translate } from 'admin-on-rest';

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);

export default Translate(MyHelloButton);

```

## Using Specific Polyglot Features

Polyglot.js is a fantastic library: in addition to being small, fully maintained, and totally framework agnostic, it provides pretty features such as interpolation and pluralization, that you can use in admin-on-rest.

```js
const messages = {
    'hello_name': 'Hello, %{name}',
    'count_beer': '%{smart_count} beer |||| %{smart_count} beers',
}

// Interpolation
translate('hello_name', { name: 'John Doe' });
=> "Hello, John Doe."

// Pluralization
translate('count_beer', { smart_count: 1 });
=> "1 beer"

translate('count_beer', { smart_count: 2 });
=> "2 beers"
```

To find more detailed examples, please refer to [http://airbnb.io/polyglot.js/](http://airbnb.io/polyglot.js/)
