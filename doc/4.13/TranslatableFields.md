---
layout: default
title: "The TranslatableFields Component"
---

# `<TranslatableFields>`

You may have fields which are translated in multiple languages and want users to verify each translation. To display them, you can use the `<TranslatableFields>` component.

<video controls autoplay playsinline muted loop>
  <source src="./img/translatable-fields-basic.webm" type="video/webm" />
  <source src="./img/translatable-fields-basic.webm" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

`<TranslatableFields>` expects the translatable values of a record to have the following structure:

```js
const record = {
    id: 123,
    title: {
        en: 'Doctors Without Borders',
        fr: 'Médecins sans frontières',
    },
    description: {
        en:
            'International humanitarian medical non-governmental organisation of French origin',
        fr:
            "Organisation non gouvernementale (ONG) médicale humanitaire internationale d'origine française fondée en 1971 à Paris",
    }
}
```

To display translatable values, wrap the fields you want to render with `<TranslatableFields>`, like so:

```jsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  TranslatableFields,
} from "react-admin";

export const OrganizationShow = () => (
  <Show>
      <SimpleShowLayout>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" />
            <TextField source="description" />
        </TranslatableFields>
      </SimpleShowLayout>
  </Show>
);
```

`<TranslatableFields>` lets users select a locale using Material UI tabs with the locale code as their labels.

You may override the tabs labels using translation keys following this format: `ra.locales.[locale_code]`. For instance, `ra.locales.en` or `ra.locales.fr`.

**Tip**: If you want to display only one translation, you don't need `<TranslatableFields>`. Just use a regular field with a path as `source`:

```jsx
{/* always display the English title */}
<TextField source="title.en" />
```

## `defaultLocale`

React-admin uses the user locale as the default locale in this field. You can override this setting using the `defaultLocale` prop.

```jsx
<TranslatableFields locales={['en', 'fr']} defaultLocale="fr">
    <TextField source="title" />
    <TextField source="description" />
</TranslatableFields>
```

## `groupKey`

If you have multiple `TranslatableFields` on the same page, you should specify a `groupKey` so that react-admin can create unique identifiers for accessibility.

```jsx
<TranslatableFields locales={['en', 'fr']} groupKey="essential-fields">
    <TextField source="name" />
    <TextField source="description" />
</TranslatableFields>
```

## `selector`

<video controls autoplay playsinline muted loop>
  <source src="./img/translatable-fields-with-custom-selector.webm" type="video/webm" />
  <source src="./img/translatable-fields-with-custom-selector.webm" type="video/mp4" />
  Your browser does not support the video tag.
</video>

You may override the language selector using the `selector` prop, which accepts a React element:

```jsx
// in src/NgoShow.tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  TranslatableFields,
  useTranslatableContext,
} from "react-admin";

const Selector = () => {
  const { locales, selectLocale, selectedLocale } = useTranslatableContext();

  const handleChange = (event) => {
    selectLocale(event.target.value);
  };

  return (
    <select
      aria-label="Select the locale"
      onChange={handleChange}
      value={selectedLocale}
    >
      {locales.map((locale) => (
        <option
          key={locale}
          value={locale}
          // This allows to correctly link the containers for each locale to their labels
          id={`translatable-header-${locale}`}
        >
          {locale}
        </option>
      ))}
    </select>
  );
};

export const NgoShow = () => (
  <Show>
    <SimpleShowLayout>
      <TranslatableFields locales={["en", "fr"]} selector={<Selector />}>
        <TextField source="title" />
        <TextField source="description" />
      </TranslatableFields>
    </SimpleShowLayout>
  </Show>
);
```

## Using Translatable Fields In List Views

The `TranslatableFields` component is not meant to be used inside a `List` as you probably don't want to have tabs inside multiple lines. The simple solution to display a translatable value would be to specify its source like this: `name.en`. However, you may want to display its translation for the current admin locale.

In this case, you'll have to get the current locale through the `useLocaleState` hook and set the translatable field `source` dynamically.

{% raw %}
```jsx
import { List, Datagrid, TextField, ReferenceArrayField, SingleFieldList, ChipField, useLocaleState } from 'react-admin';

const PostList = () => {
    const [locale] = useLocaleState();

    return (
        <List>
            <Datagrid>
                <TextField source={`name.${locale}`} />
                <ReferenceArrayField
                    label="Tags"
                    reference="tags"
                    source="tags"
                    sortBy="tags.name"
                    sort={{ field: `name.${locale}`, order: 'ASC' }}
                >
                    <SingleFieldList>
                        <ChipField source={`name.${locale}`} size="small" />
                    </SingleFieldList>
                </ReferenceArrayField>
            </Datagrid>
        </List>
    )
}
```
{% endraw %}

Note that you can't have an [optimized](https://marmelab.com/react-admin/List.html#performance) Datagrid when doing so, as changing the locale wouldn't trigger a render of its children.

The same pattern applies to show views when you don't want to display all translations: get the locale from the `useLocale` hook and dynamically set the `source` prop of the translatable fields.
