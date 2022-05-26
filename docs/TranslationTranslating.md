---
layout: default
title: "Translating"
---

# Translating

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

## Translating The Interface

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
{
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
}
```

## Translating Record Fields

Some of your records may contain fields that are translated in multiple languages. It's common, in such cases, to offer an interface allowing admin users to see and edit each translation. React-admin provides 2 components for that:

- To display translatable fields, use the [`<TranslatableFields>`](./TranslatableFields.md) component
- To edit translatable fields, use the [`<TranslatableInputs>`](./TranslatableInputs.md) component

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
