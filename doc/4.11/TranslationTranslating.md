---
layout: default
title: "Translating"
---

# Translating UI Components

The messages returned by the `polyglotI18nProvider` function argument should be a dictionary where the keys identify interface components, and values are the translated string. This dictionary is a simple JavaScript object looking like the following:

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

All react-admin core components use keys starting with the `ra` prefix, to prevent collisions with your own custom translations.

The default (English) messages are available in [the `ra-language-english` package source](https://github.com/marmelab/react-admin/blob/master/packages/ra-language-english/src/index.ts).


**Tip**: You can see the raw translation keys in the UI by passing a dummy `i18nProvider` to the `<Admin>` component:

```jsx
const i18nProvider = {
    translate: key => key,
    changeLocale: locale => Promise.resolve(),
    getLocale: () => 'en',
}

const App = () => (
    <Admin 
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
    >
        {/* ... */}
    </Admin>
);
```

## Translating Resource and Field Names

When react-admin needs to render a resource name ("post", "comment", etc.) or a field name ("title", "first_name", etc.), it "humanizes" the technical identifier to make it look better (e.g. "first_name" becomes "First name").

However, before humanizing names, react-admin checks the `messages` dictionary for a possible translation, with the following keys:

- `resources.${resourceName}.name` for resource names (used for the menu and page titles)
- `resources.${resourceName}.fields.${fieldName}` for field names (used for datagrid header and form input labels)

This lets you customize resource and field names for each locale.

Create an object containing the translation messages for your app resource and field names:

```js
// in src/i18n/en.js
import englishMessages from 'ra-language-english';

export const en = {
    ...englishMessages,
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
};
```

What's with the strange `||||` syntax? `ra-i18n-polyglot` comes with [a pluralization system](https://airbnb.io/polyglot.js/#pluralization) allowing to define both singular and plural translations for a key. It even works for languages with more than one plural form (like Slavic languages)!

**Tip**: Providing translation for resource and field names using the `i18nProvider` is an alternative to using the `label` prop in Field and Input components, with the advantage of supporting translation.

## Translating Custom Components

If you need to translate messages in your own components, React-admin provides [the `useTranslate` hook](./useTranslate.md), which returns the `translate` function. 

Imagine a translation key for the text to translate, e.g. 'myroot.hello.world' for a 'Hello, World' button, and call the `translate` function with this key:

```jsx
// in src/MyHelloButton.js
import * as React from "react";
import { useTranslate } from 'react-admin';

export const MyHelloButton = () => {
    const translate = useTranslate();
    return (
        <button>{translate('myroot.hello.world')}</button>
    );
};
```

**Tip**: For your message identifiers, choose a different root name than `ra` and `resources`, which are reserved.

Then, in your translation messages, define the translation for the key 'myroot.hello.world':

```js
// in src/i18n/en.js
import englishMessages from 'ra-language-english';

export const en = {
    ...englishMessages,
    myroot: {
        hello: {
            world: 'Hello, World',
        },
    },
    ...
};
```

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

## Translating Form Validation Errors

In Create and Edit views, forms can use [custom validators](./Validation.md#per-input-validation-custom-function-validator). These validator functions should return translation keys rather than translated messages. React-admin automatically passes these identifiers to the translation function.

For instance, here is a validator function that only allows numbers greater than 10:

```js
// in validators/required.js
const greaterThanTen = (value, allValues, props) =>
    value <= 10
        ? 'myroot.validation.greaterThanTen'
        : undefined;

// in PersonEdit.js
const PersonEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="age" validate={greaterThanTen} />
        </SimpleForm>
    </Edit>
);

// in i18n/en.json
export default {
    myroot: {
        validation: {
            greaterThanTen: 'Should be greater than 10',
        }
    }
};
```

If the translation depends on a variable, the validator can return an object rather than a translation identifier:

```js
// in validators/minLength.js
const minLength = (min) => (value, allValues, props) => 
    value.length < min
        ? { message: 'myroot.validation.minLength', args: { min } }
        : undefined;

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

If you use [the `useNotify` hook](./useNotify.md) to display a notification to the user, you can use a translation key for the notification text. React-admin will translate it automatically - no need to call `translate`.

```jsx
const ValidateCommentButton = ({ id }) => {
    const notify = useNotify();
    const [update] = useUpdate();
    const handleClick = () => {
        update(
            'comments',
            { id, data: { status: 'approved' } },
            { onSuccess: () => notify('myroot.comments.validate.success') }
        );
    };
    return <button onClick={handleClick}>Validate</button>;
}
```

## Interpolation, Pluralization and Default Translation

If you're using [`ra-i18n-polyglot`](./Translation.md#ra-i18n-polyglot) (the default `i18nProvider`), you can leverage the advanced features of its `translate` function. [Polyglot.js](https://airbnb.io/polyglot.js/), the library behind `ra-i18n-polyglot`, provides some nice features such as interpolation and pluralization, that you can use in react-admin.

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

Check out the [Polyglot.js documentation](https://airbnb.io/polyglot.js/) for more information.

## Translating Record Content

Some of your records may contain data with multiple versions - one for each locale. 

For instance, a product may have one reference, but several names. A `product` record would look like this:

```jsx
{
    id: 123,
    reference: 'GURSIKSO',
    name: {
        en: 'Evening dress',
        fr: 'Robe du soir',
    }
}
```

React-admin provides a specialized component to display such translatable data ([`<TranslatableFields>`](./TranslatableFields.md)), and another specialized component to edit it ([`<TranslatableInputs>`](./TranslatableInputs.md)):

```jsx
import { Edit, SimpleForm, TextInput, TranslatableInputs } from 'react-admin';

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="reference" />
            <TranslatableInputs locales={['en', 'fr']}>
                <TextInput source="name" />
            </TranslatableInputs>
        </SimpleForm>
    </Edit>
);
```

Check the documentation for each of these components for details. 

## Forcing The Case in Confirm messages and Empty Page

In confirmation messages and on the empty page, the resource name appears in the middle of sentences, and react-admin automatically sets the resource name translation to lower case.

> Are you sure you want to delete this comment?

This works in English, but you may want to display resources in another way to match with language rules, like in German, where names are always capitalized.

> Sind Sie sicher, dass Sie diesen Kommentar löschen möchten?

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
