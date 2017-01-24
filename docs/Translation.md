---
layout: default
title: "Translation"
---

# Translation

The admin-on-rest interface uses English as the default language. But it also supports any other language, thanks to the [polyglot.js](http://airbnb.io/polyglot.js/) library.

## Changing Locale

To handle translations, the `<Admin>` component supports a `locale` prop ('`en`' by default). Override it with the locale of your choice to change the locale at runtime:

```js
import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'admin-on-rest';

const App = () => (
    <Admin ...(your props) locale='fr'>
        ...
    </Admin>
);

export default App;
```

The core interface is available in the following languages:

- English (`en`)
- French (`fr`)

If you want to contribute a new translation for your own language, feel free to submit a pull request.

## Using The Browser Locale

It is also possible to use another locale, as long as the corresponding translation is available with it.

Admin-on-rest provides a helper function named `resolveBrowserLocale()`, which helps you to introduce a dynamic locale attribution based on the locale configured in the user's browser. To use it, simply pass the function as `locale` prop.

```js
import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'admin-on-rest';

const App = () => (
    <Admin ...(your props) locale={resolveBrowserLocale()}>
        ...
    </Admin>
);

export default App;
```

## Translation Messages

Admin-on-rest uses a dictionary to translate the interface. This dictionary is a simple JavaScript object looking like the following:

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

## Translating Your Resources

By default, Admin-on-rest uses your resource's name everywhere in the interface without taking into account the current user locale.

To translate your resource, you must add it to the dictionary into the language(s) you want to cover under the special key "resource". After what, it will be automaticaly translated at runtime if resource name match.

For example, if you want to translate your "shoe" resource, you must add the following object to the `messages` dictionary:

```js

{
    en: {
        resources: {
            shoe: 'Shoe |||| Shoes'
        }
    },
    fr: {
        resources: {
            shoe: 'Chaussure |||| Chaussures'
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
    translate: PropTypoes.function,
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
