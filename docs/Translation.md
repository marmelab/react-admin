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

```jsx
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

## Available Locales

You can find translation packages for the following languages:

- English (`en`) is the default
- Chinese (`cn`): [downup2u/aor-language-chinese](https://github.com/downup2u/aor-language-chinese)
- Chinese (Traditional) (`cht`): [leesei/aor-language-chinese-traditional](https://github.com/leesei/aor-language-chinese-traditional)
- Czech (`cs`): [magikMaker/aor-language-czech](https://github.com/magikMaker/aor-language-czech)
- Danish (`da`): [SSA111/aor-language-danish](https://github.com/SSA111/aor-language-danish)
- Dutch (`nl`): [pimschaaf/aor-language-dutch](https://github.com/pimschaaf/aor-language-dutch)
- Farsi (`fa`): [hamidfzm/aor-language-farsi](https://github.com/hamidfzm/aor-language-farsi)
- French (`fr`): [marmelab/aor-language-french](https://github.com/marmelab/aor-language-french)
- German (`de`): [der-On/aor-language-german](https://github.com/der-On/aor-language-german)
- Greek (`el`): [zifnab87/aor-language-greek](https://github.com/zifnab87/aor-language-greek)
- Hebrew (`he`): [mstmustisnt/aor-language-hebrew](https://github.com/mstmustisnt/aor-language-hebrew)
- Hungarian (`hu`): [s33m4nn/aor-language-hungarian](https://github.com/s33m4nn/aor-language-hungarian)
- Italian (`it`): [stefsava/aor-language-italian](https://github.com/stefsava/aor-language-italian)
- Japanese (`ja`): [kuma-guy/aor-language-japanese](https://github.com/kuma-guy/aor-language-japanese)
- Norwegian (`nb`): [zeusbaba/aor-language-norwegian](https://github.com/zeusbaba/aor-language-norwegian)
- Polish (`pl`): [KamilDzierbicki/aor-language-polish](https://github.com/KamilDzierbicki/aor-language-polish)
- Portuguese (`pt`): [movibe/aor-language-portugues](https://github.com/movibe/aor-language-portugues)
- Russian (`ru`): [cytomich/aor-language-russian](https://github.com/cytomich/aor-language-russian)
- Spanish (`es`): [blackboxvision/aor-language-spanish](https://github.com/BlackBoxVision/aor-language-spanish)
- Swedish (`sv`): [StefanWallin/aor-language-swedish](https://github.com/StefanWallin/aor-language-swedish)
- Thai (`th`): [liverbool/aor-language-thai](https://github.com/liverbool/aor-language-thai)
- Turkish (`tr`): [ismailbaskin/aor-language-turkish](https://github.com/ismailbaskin/aor-language-turkish)
- Ukrainian (`uk`): [vitivs/aor-language-ukrainian](https://github.com/vitivs/aor-language-ukrainian)
- Vietnamese (`vi`): [kimkha/aor-language-vietnamese](https://github.com/kimkha/aor-language-vietnamese)

If you want to contribute a new translation, feel free to submit a pull request to update [this page](https://github.com/marmelab/admin-on-rest/blob/master/docs/Translation.md) with a link to your package.

## Changing Locale At Runtime

If you want to offer the ability to change locale at runtime, you must provide the messages for all possible translations:

```jsx
import React from 'react';
import { Admin, Resource, englishMessages } from 'admin-on-rest';
import frenchMessages from 'aor-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};

const App = () => (
    <Admin ...(your props) locale="en" messages={messages}>
        ...
    </Admin>
);

export default App;
```

Then, dispatch the `CHANGE_LOCALE` action, by using the `changeLocale` action creator. For instance, the following component switches language between English and French:

```jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { changeLocale as changeLocaleAction } from 'admin-on-rest';

class LocaleSwitcher extends Component {
    switchToFrench = () => this.changeLocale('fr');
    switchToEnglish = () => this.changeLocale('en');

    render() {
        const { changeLocale } = this.props;
        return (
            <div>
                <div style={styles.label}>Language</div>
                <RaisedButton style={styles.button} label="en" onClick={this.switchToEnglish} />
                <RaisedButton style={styles.button} label="fr" onClick={this.switchToFrench} />
            </div>
        );
    }
}

export default connect(undefined, { changeLocale: changeLocaleAction })(LocaleSwitcher);
```

## Using The Browser Locale

Admin-on-rest provides a helper function named `resolveBrowserLocale()`, which helps you to introduce a dynamic locale attribution based on the locale configured in the user's browser. To use it, simply pass the function as `locale` prop.

```jsx
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

The `message` value should be a dictionary with one entry per language supported. For a given language, the keys identify interface components, and values are the translated string. This dictionary is a simple JavaScript object looking like the following:

```jsx
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

All core translations are in the `aor` namespace, in order to prevent collisions with your own custom translations. The root key used at runtime is determined by the value of the `locale` prop.

The default messages are available [here](https://github.com/marmelab/admin-on-rest/blob/master/src/i18n/messages.js).

## Translating Resource and Field Names

By default, Admin-on-rest uses resource names ("post", "comment", etc) and field names ("title", "first_name", etc) everywhere in the interface. It simply "humanizes" the technical identifiers to make them look better (e.g. "first_name" becomes "First name").

However, before humanizing names, admin-on-rest checks the `messages` dictionary for a possible translation, with the following keys:

- `${locale}.resources.${resourceName}.name` for resource names (used for the menu and page titles)
- `${locale}.resources.${resourceName}.fields.${fieldName}` for field names (used for datagrid header and form input labels)

This lets you translate your own resource and field names by passing a `messages` object with a `resources` key:

```jsx
{
    en: {
        resources: {
            shoe: {
                name: 'Shoe |||| Shoes',
                fields: {
                    model: 'Model',
                    stock: 'Nb in stock',
                    color: 'Color',
                },
            },
            customer: {
                name: 'Customer |||| Customers',
                fields: {
                    first_name: 'First name',
                    last_name: 'Last name',
                    dob: 'Date of birth',
                }
            }
        }
    },
    ...
}
```

As you can see, [polyglot pluralization](http://airbnb.io/polyglot.js/#pluralization) is used here, but it is optional.

Using `resources` keys is an alternative to using the `label` prop in Field and Input components, with the advantage of supporting translation.

## Mixing Interface and Domain Translations

When translating an admin, interface messages (e.g. "List", "Page", etc.) usually come from a third-party package, while your domain messages (e.g. "Shoe", "Date of birth", etc.) come from your own code. That means you need to combine these messages before passing them to `<Admin>`. The recipe for combining messages is to use ES6 destructuring:

```jsx
// interface translations
import { englishMessages } from 'admin-on-rest';
import frenchMessages from 'aor-language-french';

// domain translations
import * as domainMessages from './i18n';

const messages = {
    fr: { ...frenchMessages, ...domainMessages.fr },
    en: { ...englishMessages, ...domainMessages.en },
};

const App = () => (
    <Admin ...(your props) messages={messages}>
        ...
    </Admin>
);
```

## Translating Your Own Components

The translation system use the React `context` to pass translations down the component tree. To translate a sentence, use the `translate` function from the context. Of course, this assumes that you've previously added the corresponding translation to the `messages` props of the `Admin` component.

```jsx
// in src/MyHelloButton.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MyHelloButton {
    render() {
        const { translate } = this.context;
        return <button>{translate('myroot.hello.world')}</button>;
    }
}
MyHelloButton.contextTypes = {
    translate: PropTypes.func,
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

However, using the context makes components harder to test. That's why admin-on-rest provides a `translate` Higher-Order Component, which simply passes the `translate` function from context to props:

```jsx
// in src/MyHelloButton.js
import React from 'react';
import { translate } from 'admin-on-rest';

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);

export default translate(MyHelloButton);
```

**Tip**: For your message identifiers, choose a different root name than `aor` and `resources`, which are reserved.

**Tip**: Don't use `translate` for Field and Input labels, or for page titles, as they are already translated:

```jsx
// don't do this
<TextField source="first_name" label={translate('myroot.first_name')} />

// do this instead
<TextField source="first_name" label="myroot.first_name" />

// or even better, use the default translation key
<TextField source="first_name" />
// and translate the `resources.customers.fields.first_name` key
```

## Using Specific Polyglot Features

Polyglot.js is a fantastic library: in addition to being small, fully maintained, and totally framework agnostic, it provides some nice features such as interpolation and pluralization, that you can use in admin-on-rest.

```jsx
const messages = {
    'hello_name': 'Hello, %{name}',
    'count_beer': 'One beer |||| %{smart_count} beers',
}

// interpolation
translate('hello_name', { name: 'John Doe' });
=> 'Hello, John Doe.'

// pluralization
translate('count_beer', { smart_count: 1 });
=> 'One beer'

translate('count_beer', { smart_count: 2 });
=> '2 beers'

// default value
translate('not_yet_translated', { _: 'Default translation' })
=> 'Default translation'
```

To find more detailed examples, please refer to [http://airbnb.io/polyglot.js/](http://airbnb.io/polyglot.js/)
