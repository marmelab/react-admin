---
layout: default
title: "Translation"
---

# Translation

The react-admin user interface uses English as the default language. But you can also display the UI and content in other languages, allow changing language at runtime, even lazy-loading optional languages to avoid increasing the bundle size with all translations. 

You will use translation features mostly via the `i18nProvider`, and a set of hooks (`useTranslate`, `useLocale`, `useSetLocale`).

**Tip**: We'll use a bit of custom vocabulary in this chapter:
 
- "i18n" is a shorter way to write "internationalization" (an "i" followed by 18 letters followed by "n") 
- "locale" is a concept similar to languages, but it also includes the concept of country. For instance, there are several English locales (like `en_us` and `en_gb`) because US and UK citizens don't use exactly the same language. For react-admin, the "locale" is just a key for your i18nProvider, so it can have any value you want.

## Introducing the `i18nProvider`

Just like for data fetching and authentication, react-admin relies on a simple object for translations. It's called the `i18nProvider`, and it manages translation and language change using two methods:

```js
const i18nProvider = {
    translate: (key, options) => string,
    changeLocale: locale => Promise,
    getLocale: () => string,
}
```

And just like for the `dataProvider` and the `authProvider`, you can *inject* the `i18nProvider` to your react-admin app using the `<Admin>` component:

```jsx
import i18nProvider from './i18n/i18nProvider';

const App = () => (
    <Admin 
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
    >
        <Resource name="posts" list={/* ... */}>
        // ...
```

If you want to add or update translations, you'll have to provide your own `i18nProvider`.

React-admin components use translation keys for their labels, and rely on the `i18nProvider` to translate them. For instance:

```jsx
const SaveButton = ({ doSave }) => {
    const translate = useTranslate(); // returns the i18nProvider.translate() method
    return (
        <Button onClick={doSave}>
            {translate('ra.action.save')} // will translate to "Save" in English and "Enregistrer" in French
        </Button>
    );
};
```

## Using Polyglot.js

Here is the simplest possible implementation for an `i18nProvider` with English and French messages:

```js
import lodashGet from 'lodash/get';

const englishMessages = {
    ra: {
        notification: {
            http_error: 'Network error. Please retry',
        },
        action: {
            save: 'Save',
            delete: 'Delete',
        },
    },
};
const frenchMessages = {
    ra: {
        notification: {
            http_error: 'Erreur réseau, veuillez réessayer',
        },
        action: {
            save: 'Enregistrer',
            delete: 'Supprimer',
        },
    },
};
let messages = englishMessages;

let locale = 'en';

const i18nProvider = {
    translate: key => lodashGet(messages, key),
    changeLocale: newLocale => {
        messages = (newLocale === 'fr') ? frenchMessages : englishMessages;
        locale = newLocale;
        return Promise.resolve();
    },
    getLocale: () => locale
};
```

But this is too naive: react-admin expects that i18nProviders support string interpolation for translation, and asynchronous message loading for locale change. That's why react-admin bundles an `i18nProvider` *factory* called `polyglotI18nProvider`. This factory relies on [polyglot.js](https://airbnb.io/polyglot.js/), which uses JSON files for translations. It only expects one argument: a function returning a list of messages based on a locale passed as argument. 

So the previous provider can be written as:

```js
import polyglotI18nProvider from 'ra-i18n-polyglot';

const englishMessages = {
    ra: {
        notification: {
            http_error: 'Network error. Please retry',
        },
        action: {
            save: 'Save',
            delete: 'Delete',
        },
    },
};
const frenchMessages = {
    ra: {
        notification: {
            http_error: 'Erreur réseau, veuillez réessayer',
        },
        action: {
            save: 'Enregistrer',
            delete: 'Supprimer',
        },
    },
};

const i18nProvider = polyglotI18nProvider(locale => 
    locale === 'fr' ? frenchMessages : englishMessages,
    'en' // Default locale
);
```

## Changing The Default Locale

The default react-admin locale is `en`, for English. If you want to display the interface in another language by default, you'll have to install a third-party package. For instance, to change the interface to French, you must install the `ra-language-french` npm package, then use it in a custom `i18nProvider`, as follows:

```jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';

const i18nProvider = polyglotI18nProvider(() => frenchMessages, 'fr');

const App = () => (
    <Admin i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

## Available Locales

You can find translation packages for the following languages:

- Arabic (`ar`): [developerium/ra-language-arabic](https://github.com/developerium/ra-language-arabic)
- Armenian (`am`): [mrdntgrn/ra-language-armenian](https://github.com/mrdntgrn/ra-language-armenian)
- Belarusian (`be`): [tui-ru/ra-language-belarusian](https://github.com/tui-ru/ra-language-belarusian)
- Brazilian Portuguese (`pt-br`): [gucarletto/ra-language-pt-br](https://github.com/gucarletto/ra-language-pt-br)
- Bulgarian (`bg`): [ptodorov0/ra-language-bulgarian](https://github.com/ptodorov0/ra-language-bulgarian)
- Catalan (`ca`): [joshf/ra-language-catalan](https://github.com/joshf/ra-language-catalan)
- Chinese (`zh-TW`): [areyliu6/ra-language-chinese-traditional](https://github.com/areyliu6/ra-language-chinese-traditional)
- Chinese (`zh`): [chen4w/ra-language-chinese](https://github.com/chen4w/ra-language-chinese)
- Czech (`cs`): [binao/ra-language-czech](https://github.com/binao/ra-language-czech)
- Danish (`da`): [nikri/ra-language-danish](https://github.com/nikri/ra-language-danish)
- Dutch (`nl`): [nickwaelkens/ra-language-dutch](https://github.com/nickwaelkens/ra-language-dutch)
- English (`en`): [marmelab/ra-language-english](https://github.com/marmelab/react-admin/tree/master/packages/ra-language-english)
- Estonian (`et`): [tui-ru/ra-language-estonian](https://github.com/tui-ru/ra-language-estonian)
- Farsi (`fa`): [hamidfzm/ra-language-farsi](https://github.com/hamidfzm/ra-language-farsi)
- Finnish (`fi`): [aikain/ra-language-finnish](https://github.com/aikain/ra-language-finnish)
- French (`fr`): [marmelab/ra-language-french](https://github.com/marmelab/react-admin/tree/master/packages/ra-language-french)
- German (`de`): [greenbananaCH/ra-language-german](https://github.com/greenbananaCH/ra-language-german) (tree translation: [straurob/ra-tree-language-german](https://github.com/straurob/ra-tree-language-german))
- Greek (`el`): [panterz/ra-language-greek](https://github.com/panterz/ra-language-greek)
- Hebrew (`he`): [ak-il/ra-language-hebrew](https://github.com/ak-il/ra-language-hebrew)
- Hindi (`hi`): [harshit-budhraja/ra-language-hindi](https://github.com/harshit-budhraja/ra-language-hindi)
- Hungarian (`hu`): [phelion/ra-language-hungarian](https://github.com/phelion/ra-language-hungarian)
- Indonesian (`id`): [danangekal/ra-language-indonesian-new](https://github.com/danangekal/ra-language-indonesian-new)
- Italian (`it`): [stefsava/ra-italian](https://github.com/stefsava/ra-italian)
- Japanese (`ja`): [bicstone/ra-language-japanese](https://github.com/bicstone/ra-language-japanese)
- Korean (`ko`): [acidsound/ra-language-korean](https://github.com/acidsound/ra-language-korean)
- Latvian (`lv`): [tui-ru/ra-language-latvian](https://github.com/tui-ru/ra-language-latvian)
- Lithuanian (`lt`): [tui-ru/ra-language-lithuanian](https://github.com/tui-ru/ra-language-lithuanian)
- Malay (`ms`): [kayuapi/ra-language-malay](https://github.com/kayuapi/ra-language-malay.git)
- Norwegian (`no`): [jon-harald/ra-language-norwegian](https://github.com/jon-harald/ra-language-norwegian)
- Polish (`pl`): [tymek/ra-language-polish](https://github.com/tymek/ra-language-polish)
- Portuguese (`pt`): [henriko202/ra-language-portuguese](https://github.com/henriko202/ra-language-portuguese)
- Romanian (`ro`): [gyhaLabs/ra-language-romanian](https://github.com/gyhaLabs/ra-language-romanian)
- Russian (`ru`): [klucherev/ra-language-russian](https://github.com/klucherev/ra-language-russian)
- Slovak (`sk`): [zavadpe/ra-language-slovak](https://github.com/zavadpe/ra-language-slovak)
- Spanish (`es`): [blackboxvision/ra-language-spanish](https://github.com/BlackBoxVision/ra-language-spanish)
- Swedish (`sv`): [kolben/ra-language-swedish](https://github.com/kolben/ra-language-swedish)
- Turkish (`tr`): [KamilGunduz/ra-language-turkish](https://github.com/KamilGunduz/ra-language-turkish)
- Ukrainian (`ua`): [koresar/ra-language-ukrainian](https://github.com/koresar/ra-language-ukrainian)
- Vietnamese (`vi`): [hieunguyendut/ra-language-vietnamese](https://github.com/hieunguyendut/ra-language-vietnamese)

In addition, the previous version of react-admin, called admin-on-rest, was translated in the following languages:

- Chinese (Traditional) (`cht`): [leesei/aor-language-chinese-traditional](https://github.com/leesei/aor-language-chinese-traditional)
- Croatian (`hr`): [ariskemper/aor-language-croatian](https://github.com/ariskemper/aor-language-croatian)
- Slovenian (`sl`): [ariskemper/aor-language-slovenian](https://github.com/ariskemper/aor-language-slovenian)
- Thai (`th`): [liverbool/aor-language-thai](https://github.com/liverbool/aor-language-thai)

These packages are not directly interoperable with react-admin, but the upgrade is straightforward; rename the root key from "aor" to "ra". We invite the authors of the packages listed above to republish their translations for react-admin, using a different package name.

If you want to contribute a new translation, feel free to submit a pull request to update [this page](https://github.com/marmelab/react-admin/blob/master/docs/Translation.md) with a link to your package.

## `useSetLocale`: Changing Locale At Runtime

If you want to offer the ability to change locale at runtime, you must provide an `i18nProvider` that contains the messages for all possible locales:

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

Then, use the `useSetLocale` hook to change locale. For instance, the following component allows the user to switch the interface language between English and French:

```jsx
import * as React from "react";
import Button from '@material-ui/core/Button';
import { useSetLocale } from 'react-admin';

const LocaleSwitcher = () => {
    const setLocale = useSetLocale();
    return (
        <div>
            <div>Language</div>
            <Button onClick={() => setLocale('fr')}>English</Button>
            <Button onClick={() => setLocale('en')}>French</Button>
        </div>
    );
};

export default LocaleSwitcher;
```

## `useLocale`: Getting The Current Locale

Your language switcher component probably needs to know the current locale, in order to disable/transform the button for the current language. The `useLocale` hook returns the current locale:

```jsx
import * as React from 'react';
import { Component } from 'react';
import Button from '@material-ui/core/Button';
import { useLocale, useSetLocale } from 'react-admin';

const LocaleSwitcher = () => {
    const locale = useLocale();
    const setLocale = useSetLocale();
    return (
        <div>
            <div>Language</div>
            <Button 
                disabled={locale === 'fr'}
                onClick={() => setLocale('fr')}
            >
                English
            </Button>
            <Button
                disabled={locale === 'en'}
                onClick={() => setLocale('en')}
            >
                French
            </Button>
        </div>
    );
};

export default LocaleSwitcher;
```

## Lazy-Loading Locales

Bundling all the possible locales in the `i18nProvider` is a great recipe to increase your bundle size, and slow down the initial application load. Fortunately, the `i18nProvider` returns a *promise* for locale change calls to load secondary locales on demand. And the `polyglotI18nProvider` accepts when its argument function returns a Promise, too. For example:

```js
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from '../en.js';

const i18nProvider = polyglotI18nProvider(locale => {
    if (locale === 'en') {
        // initial call, must return synchronously
        return englishMessages;
    }
    if (locale === 'fr') {
        return import('../i18n/fr.js').then(messages => messages.default);
    }
}, 'en');

const App = () => (
    <Admin i18nProvider={i18nProvider}>
        ...
    </Admin>
);
```

## Using The Browser Locale

React-admin provides a helper function named `resolveBrowserLocale()`, which detects the user's browser locale. To use it, simply pass the function as the `initialLocale` argument of `polyglotI18nProvider`.

```jsx
import * as React from "react";
import { 
    Admin,
    Resource,
    resolveBrowserLocale,
} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};
const i18nProvider = polyglotI18nProvider(
    locale => messages[locale] ? messages[locale] : messages.en,
    resolveBrowserLocale()
);

const App = () => (
    <Admin i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

Beware that users from all around the world may use your application, so make sure the `i18nProvider` returns default messages even for unknown locales?

## Restoring The Locale Choice

The `<LanguageSwitcher>` component is part of `ra-preferences`, an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> module. It displays a button in the App Bar letting users choose their preferred language, and **persists that choice in localStorage**. Users only have to set their preferred locale once per browser.

```jsx
import * as React from 'react';
import { LanguageSwitcher } from '@react-admin/ra-preferences';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { Admin, Resource, List, SimpleList, Layout, AppBar } from 'react-admin';
import { Box, Typography } from '@material-ui/core';

const MyAppBar = props => (
    <AppBar {...props}>
        <Box flex="1">
            <Typography variant="h6" id="react-admin-title"></Typography>
        </Box>
        <LanguageSwitcher
            languages={[
                { locale: 'en', name: 'English' },
                { locale: 'fr', name: 'Français' },
            ]}
            defaultLanguage="English"
        />
    </AppBar>
);

const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en' // Default locale
);

const App = () => (
    <Admin
        i18nProvider={i18nProvider}
        dataProvider={dataProvider}
        layout={MyLayout}
    >
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

Check [the `ra-preferences` documentation](https://marmelab.com/ra-enterprise/modules/ra-preferences) for more details.

## Translation Messages

The `message` returned by the `polyglotI18nProvider` function argument should be a dictionary where the keys identify interface components, and values are the translated string. This dictionary is a simple JavaScript object looking like the following:

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

## Translating Resource and Field Names

By default, React-admin uses resource names ("post", "comment", etc.) and field names ("title", "first_name", etc.) everywhere in the interface. It simply "humanizes" the technical identifiers to make them look better (e.g. "first_name" becomes "First name").

However, before humanizing names, react-admin checks the `messages` dictionary for a possible translation, with the following keys:

- `resources.${resourceName}.name` for resource names (used for the menu and page titles)
- `resources.${resourceName}.fields.${fieldName}` for field names (used for datagrid header and form input labels)

This lets you translate your own resource and field names by passing a `messages` object with a `resources` key:

```js
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

As you can see, [polyglot pluralization](https://airbnb.io/polyglot.js/#pluralization) is used here, but it is optional.

Using `resources` keys is an alternative to using the `label` prop in Field and Input components, with the advantage of supporting translation.

## Mixing Interface and Domain Translations

When translating an admin, interface messages (e.g. "List", "Page", etc.) usually come from a third-party package, while your domain messages (e.g. "Shoe", "Date of birth", etc.) come from your own code. That means you need to combine these messages before passing them to `<Admin>`. The recipe for combining messages is to use ES6 destructuring:

```jsx
import { Admin } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
// interface translations
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

// domain translations
import * as domainMessages from './i18n';

const messages = {
    fr: { ...frenchMessages, ...domainMessages.fr },
    en: { ...englishMessages, ...domainMessages.en },
};
const i18nProvider = polyglotI18nProvider(locale => messages[locale]);

const App = () => (
    <Admin i18nProvider={i18nProvider}>
        ...
    </Admin>
);
```

## `useTranslate` Hook

If you need to translate messages in your own components, React-admin provides a `useTranslate` hook, which returns the `translate` function:

```jsx
// in src/MyHelloButton.js
import * as React from "react";
import { useTranslate } from 'react-admin';

const MyHelloButton = () => {
    const translate = useTranslate();
    return (
        <button>{translate('myroot.hello.world')}</button>
    );
};

export default MyHelloButton;
```

**Tip**: For your message identifiers, choose a different root name than `ra` and `resources`, which are reserved.

**Tip**: Don't use `useTranslate` for Field and Input labels, or for page titles, as they are already translated:

```jsx
// don't do this
<TextField source="first_name" label={translate('myroot.first_name')} />

// do this instead
<TextField source="first_name" label="myroot.first_name" />

// or even better, use the default translation key
<TextField source="first_name" />
// and translate the `resources.customers.fields.first_name` key
```

## `withTranslate` HOC

If you're stuck with class components, react-admin also exports a `withTranslate` higher-order component, which injects the `translate` function as prop. 

```jsx
// in src/MyHelloButton.js
import * as React from 'react';
import { Component } from 'react';
import { withTranslate } from 'react-admin';

class MyHelloButton extends Component {
    render() {
        const { translate } = this.props;
        return (
            <button>{translate('myroot.hello.world')}</button>
        );
    } 
};

export default withTranslate(MyHelloButton);
```

## Using Specific Polyglot Features

Polyglot.js is a fantastic library: in addition to being small, fully maintained, and totally framework-agnostic, it provides some nice features such as interpolation and pluralization, that you can use in react-admin.

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

To find more detailed examples, please refer to [https://airbnb.io/polyglot.js/](https://airbnb.io/polyglot.js/)

## Translating Validation Errors

In Create and Edit views, forms can use custom validators. These validator functions should return translation keys rather than translated messages. React-admin automatically passes these identifiers to the translation function: 

```js
// in validators/required.js
const required = () => (value, allValues, props) =>
    value
        ? undefined
        : 'myroot.validation.required';

// in i18n/en.json
export default {
    myroot: {
        validation: {
            required: 'Required field',
        }
    }
};
```

If the translation depends on a variable, the validator can return an object rather than a translation identifier:

```js
// in validators/minLength.js
const minLength = (min) => (value, allValues, props) => 
    value.length >= min
        ? undefined
        : { message: 'myroot.validation.minLength', args: { min } };

// in i18n/en.js
export default {
    myroot: {
        validation: {
            minLength: 'Must be %{min} characters at least',
        }
    }
};
```

## Translating Notification Messages

By default, react-admin translates the notification messages. You can pass variables for polyglot interpolation with custom notifications. For example:

```js
notify('myroot.hello.world', { messageArgs: { name: 'Planet Earth' } });
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

## Translating The Empty Page

React-admin uses the keys `ra.page.empty` and `ra.page.invite` when displaying the page inviting the user to create the first record.

If you want to override these messages in a specific resource you can add the following keys to your translation:

- `resources.${resourceName}.empty` for the primary message (e.g. "No posts yet.")
- `resources.${resourceName}.invite` for the message inviting the user to create one (e.g. "Do you want to create one?")

## Specific case in Confirm messages and Empty Page

In confirm messages and in the empty page, the resource name appears in the middle of sentences, and react-admin automatically sets the resource name translation to lower case.

> Are you sure you want to delete this comment?

This works in English, but you may want to display resources in another way to match with language rules, like in German, where names are always capitalized.
ie: `Sind Sie sicher, dass Sie diesen Kommentar löschen möchten?`

To do this, simply add a `forcedCaseName` key next to the `name` key in your translation file.

```js
resources: {
    comments: {
        name: 'Kommentar |||| Kommentare',
        forcedCaseName: 'Kommentar |||| Kommentare',
        fields: {
            id: 'Id',
            name: 'Bezeichnung',
        }
    }
}
```

## Silencing Translation Warnings

By default, the `polyglotI18nProvider` logs a warning in the console each time it is called with a message that can't be found in the current translations. This is a Polyglot feature that helps to track missing translation messages.

But you may want to avoid this for some messages, e.g. error messages from a data source you don't control (like a web server).

The fastest way to do so is to use the third parameter of the `polyglotI18nProvider` function to pass the `allowMissing` option to Polyglot at initialization:

```diff
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './i18n/englishMessages';
import frenchMessages from './i18n/frenchMessages';

const i18nProvider = polyglotI18nProvider(locale => 
    locale === 'fr' ? frenchMessages : englishMessages,
    'en', // Default locale
+   {
+       allowMissing: true
+   }
);
```

**Tip**: Check [the Polyglot documentation](https://airbnb.io/polyglot.js/#options-overview) for a list of options you can pass to Polyglot at startup. 

This solution is all-or-nothing: you can't silence only *some* missing translation warnings. An alternative solution consists of passing a default translation using the `_` translation option, as explained in the [Using Specific Polyglot Features section](#using-specific-polyglot-features) above. 

## Translating Record Fields

Some of your records may contain fields that are translated in multiple languages. It's common, in such cases, to offer an interface allowing admin users to see and edit each translation. React-admin provides 2 components for that:

- To display translatable fields, use the [`<TranslatableFields>`](./Fields.md#translatable-fields) component
- To edit translatable fields, use the [`<TranslatableInputs>`](./Inputs.md#translatable-inputs) component

They both expect the translatable values to have the following structure:

```js
{
    name: {
        en: 'The english value',
        fr: 'The french value',
        tlh: 'The klingon value',
    },
    description: {
        en: 'The english value',
        fr: 'The french value',
        tlh: 'The klingon value',
    }
}
```
