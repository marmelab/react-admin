---
layout: default
title: "Setup"
---

# Setup

Just like for the `dataProvider` and the `authProvider`, you can *inject* the `i18nProvider` to your react-admin app using the `<Admin>` component:

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
import { Button, useTranslate } from 'react-admin';

const SaveButton = ({ doSave }) => {
    const translate = useTranslate(); // returns the i18nProvider.translate() method
    return (
        <Button onClick={doSave}>
            {translate('ra.action.save')} // will translate to "Save" in English and "Enregistrer" in French
        </Button>
    );
};
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

Note that if the app provides a language switcher, and a user selects a different language, this choice is persisted across reloads until the user logs out.

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

**Tip**: `resolveBrowserLocale` returns the main locale string ('en', 'fr', etc.), if you use a locale with a region (e.g. 'en-US', 'en-GB'), you must pass { fullLocale:`true` } as a second argument to `resolveBrowserLocale` in order to obtain the full locale string.

```jsx
const i18nProvider = polyglotI18nProvider(
    locale => messages[locale] ? messages[locale] : messages.en,
    resolveBrowserLocale('en', { fullLocale: true }) // 'en' => Default locale when browser locale can't be resolved, { fullLocale: true } => Return full locale
);
```

Beware that users from all around the world may use your application, so make sure the `i18nProvider` returns default messages, even for unknown locales.

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

