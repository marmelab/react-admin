---
layout: default
title: "Translation"
---

# Translation

The react-admin interface uses English as the default language. But it also supports any other language, thanks to the [polyglot.js](http://airbnb.io/polyglot.js/) library.

## Changing Locale

If you want to use another locale, you'll have to install a third-party package. For instance, to change the interface to French, you must install the `ra-language-french` npm package then instruct react-admin to use it.

The `<Admin>` component has an `i18nProvider` prop, which accepts a function with the following signature:

```js
const i18nProvider = locale => messages;
```

The `messages` should be a dictionary of interface and resource names (see the [Translation Messages section](#translation-messages) below for details about the dictionary format).

React-admin calls the `i18nProvider` when it starts, passing the `locale` specified on the `Admin` component as parameter. The provider must return the messages synchronously. React-admin also calls the `i18nProvider` whenever the locale changes, passing the new locale as parameter. So the simplest example for a multilingual interface reads as follow:

```jsx
import React from 'react';
import { Admin, Resource } from 'react-admin';
import frenchMessages from 'ra-language-french';
import englishMessages from 'ra-language-english';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
}
const i18nProvider = locale => messages[locale];

const App = () => (
    <Admin locale="en" i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

The `i18nProvider` may return a promise for locale change calls (except the initial call, when the app starts). This can be useful to only load the needed locale. For example:

```js
import englishMessages from '../en.js';

const asyncMessages = {
    fr: () => import('../i18n/fr.js').then(messages => messages.default),
    it: () => import('../i18n/it.js').then(messages => messages.default),
};

const i18nProvider = locale => {
    if (locale === 'en') {
        // initial call, must return synchronously
        return englishMessages;
    }
    // change of locale after initial call returns a promise
    return asyncMessages[params.locale]();
}

const App = () => (
    <Admin locale="en" i18nProvider={i18nProvider}>
        ...
    </Admin>
);
```

## Available Locales

You can find translation packages for the following languages:

- Czech (`cs`): [binao/ra-language-czech](https://github.com/binao/ra-language-czech)
- Dutch (`nl`): [pimschaaf/ra-language-dutch](https://github.com/pimschaaf/ra-language-dutch)
- English (`en`): [marmelab/ra-language-english](https://github.com/marmelab/react-admin/tree/master/packages/ra-language-english)
- French (`fr`): [marmelab/ra-language-french](https://github.com/marmelab/react-admin/tree/master/packages/ra-language-french)
- German (`de`): [greenbananaCH/ra-language-german](https://github.com/greenbananaCH/ra-language-german)
- Indonesian (`id`): [ronadi/ra-language-indonesian](https://github.com/ronadi/ra-language-indonesian)
- Italian (`it`): [stefsava/ra-language-italian](https://github.com/stefsava/ra-language-italian)
- Russian (`ru`): [klucherev/ra-language-russian](https://github.com/klucherev/ra-language-russian)
- Slovak (`sk`): [zavadpe/ra-language-slovak](https://github.com/zavadpe/ra-language-slovak)
- Spanish (`es`): [blackboxvision/ra-language-spanish](https://github.com/BlackBoxVision/ra-language-spanish)
- Ukrainian (`ua`): [koresar/ra-language-ukrainian](https://github.com/koresar/ra-language-ukrainian)

The previous version of react-admin, called admin-on-rest, was translated in the following languages:

- Arabic ( `ع` ): [aymendhaya/aor-language-arabic](https://github.com/aymendhaya/aor-language-arabic)
- Chinese (`cn`): [downup2u/aor-language-chinese](https://github.com/downup2u/aor-language-chinese)
- Chinese (Traditional) (`cht`): [leesei/aor-language-chinese-traditional](https://github.com/leesei/aor-language-chinese-traditional)
- Croatian (`hr`): [ariskemper/aor-language-croatian](https://github.com/ariskemper/aor-language-croatian)
- Czech (`cs`): [magikMaker/aor-language-czech](https://github.com/magikMaker/aor-language-czech)
- Danish (`da`): [SSA111/aor-language-danish](https://github.com/SSA111/aor-language-danish)
- Farsi (`fa`): [hamidfzm/aor-language-farsi](https://github.com/hamidfzm/aor-language-farsi)
- Finnish (`fi`): [Joni-Aaltonen/aor-language-finnish](https://github.com/Joni-Aaltonen/aor-language-finnish)
- German (`de`): [der-On/aor-language-german](https://github.com/der-On/aor-language-german)
- Greek (`el`): [zifnab87/aor-language-greek](https://github.com/zifnab87/aor-language-greek)
- Hebrew (`he`): [motro/aor-language-hebrew](https://github.com/motro/aor-language-hebrew)
- Hungarian (`hu`): [s33m4nn/aor-language-hungarian](https://github.com/s33m4nn/aor-language-hungarian)
- Indonesian (`id`): [ronadi/aor-language-indonesian](https://github.com/ronadi/aor-language-indonesian)
- Japanese (`ja`): [kuma-guy/aor-language-japanese](https://github.com/kuma-guy/aor-language-japanese)
- Norwegian (`nb`): [zeusbaba/aor-language-norwegian](https://github.com/zeusbaba/aor-language-norwegian)
- Polish (`pl`): [KamilDzierbicki/aor-language-polish](https://github.com/KamilDzierbicki/aor-language-polish)
- Portuguese (`pt`): [movibe/aor-language-portugues](https://github.com/movibe/aor-language-portugues)
- Russian (`ru`): [cytomich/aor-language-russian](https://github.com/cytomich/aor-language-russian)
- Slovenian (`sl`): [ariskemper/aor-language-slovenian](https://github.com/ariskemper/aor-language-slovenian)
- Spanish (`es`): [blackboxvision/aor-language-spanish](https://github.com/BlackBoxVision/aor-language-spanish)
- Swedish (`sv`): [StefanWallin/aor-language-swedish](https://github.com/StefanWallin/aor-language-swedish)
- Thai (`th`): [liverbool/aor-language-thai](https://github.com/liverbool/aor-language-thai)
- Turkish (`tr`): [ismailbaskin/aor-language-turkish](https://github.com/ismailbaskin/aor-language-turkish)
- Ukrainian (`uk`): [vitivs/aor-language-ukrainian](https://github.com/vitivs/aor-language-ukrainian)
- Vietnamese (`vi`): [kimkha/aor-language-vietnamese](https://github.com/kimkha/aor-language-vietnamese)

These packages are not directly interoperable with react-admin, but the upgrade is straightforward; rename the root key from "aor" to "ra". We invite the authors of the packages listed above to republish their translations for react-admin, using a different package name.

If you want to contribute a new translation, feel free to submit a pull request to update [this page](https://github.com/marmelab/react-admin/blob/master/docs/Translation.md) with a link to your package.

## Changing Locale At Runtime

If you want to offer the ability to change locale at runtime, you must provide the messages for all possible translations:

```jsx
import React from 'react';
import { Admin, Resource } from 'react-admin';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};
const i18nProvider = locale => messages[locale];

const App = () => (
    <Admin locale="en" i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

Then, dispatch the `CHANGE_LOCALE` action, by using the `changeLocale` action creator. For instance, the following component switches language between English and French:

```jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { changeLocale as changeLocaleAction } from 'react-admin';

class LocaleSwitcher extends Component {
    switchToFrench = () => this.props.changeLocale('fr');
    switchToEnglish = () => this.props.changeLocale('en');

    render() {
        const { changeLocale } = this.props;
        return (
            <div>
                <div>Language</div>
                <Button onClick={this.switchToEnglish}>en</Button>
                <Button onClick={this.switchToFrench}>fr</Button>
            </div>
        );
    }
}

export default connect(undefined, { changeLocale: changeLocaleAction })(LocaleSwitcher);
```

## Using The Browser Locale

React-admin provides a helper function named `resolveBrowserLocale()`, which helps you to introduce a dynamic locale attribution based on the locale configured in the user's browser. To use it, simply pass the function as `locale` prop.

```jsx
import React from 'react';
import { Admin, Resource, resolveBrowserLocale } from 'react-admin';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};
const i18nProvider = locale => messages[locale];

const App = () => (
    <Admin locale={resolveBrowserLocale()} i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

## Translation Messages

The `message` returned by the `i18nProvider` value should be a dictionary where the keys identify interface components, and values are the translated string. This dictionary is a simple JavaScript object looking like the following:

```jsx
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

The default messages are available [here](https://github.com/marmelab/react-admin/blob/master/packages/ra-language-english/index.js).

## Translating Resource and Field Names

By default, React-admin uses resource names ("post", "comment", etc) and field names ("title", "first_name", etc) everywhere in the interface. It simply "humanizes" the technical identifiers to make them look better (e.g. "first_name" becomes "First name").

However, before humanizing names, react-admin checks the `messages` dictionary for a possible translation, with the following keys:

- `${locale}.resources.${resourceName}.name` for resource names (used for the menu and page titles)
- `${locale}.resources.${resourceName}.fields.${fieldName}` for field names (used for datagrid header and form input labels)

This lets you translate your own resource and field names by passing a `messages` object with a `resources` key:

```jsx
{
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
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

// domain translations
import * as domainMessages from './i18n';

const messages = {
    fr: { ...frenchMessages, ...domainMessages.fr },
    en: { ...englishMessages, ...domainMessages.en },
};
const i18nProvider = locale => messages[locale];

const App = () => (
    <Admin i18nProvider={i18nProvider}>
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

However, using the context makes components harder to test. That's why react-admin provides a `translate` Higher-Order Component, which simply passes the `translate` function from context to props:

```jsx
// in src/MyHelloButton.js
import React from 'react';
import { translate } from 'react-admin';

const MyHelloButton = ({ translate }) => (
    <button>{translate('myroot.hello.world')}</button>
);

export default translate(MyHelloButton);
```

**Tip**: For your message identifiers, choose a different root name than `ra` and `resources`, which are reserved.

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

Polyglot.js is a fantastic library: in addition to being small, fully maintained, and totally framework agnostic, it provides some nice features such as interpolation and pluralization, that you can use in react-admin.

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

## Notifications With Variables

It is possible to pass variables for polyglot interpolation with custom notifications. For example:

```js
showNotification('myroot.hello.world', 'info', { messageArgs: { name: 'Planet Earth' } });
```

Assuming you have the following in your custom messages:

```js
// in src/App.js
const messages = {
    en: {
        myroot: {
            hello: {
                world: 'Hello, %{name}!',
            },
        },
    },
};
```
