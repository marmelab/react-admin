---
layout: default
title: "The TranslatableFields Component"
---

# `<TranslatableFields>`

You may have fields which are translated in multiple languages and want users to verify each translation. To display them, you can use the `<TranslatableFields>` component, which expects the translatable values to have the following structure:

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

This is how to use it:

```jsx
<TranslatableFields locales={['en', 'fr']}>
    <TextField source="name" />
    <TextField source="description" />
</TranslatableFields>
```

React-admin uses the user locale as the default locale in this field. You can override this setting using the `defaultLocale` prop.

```jsx
<TranslatableFields locales={['en', 'fr']} defaultLocale="fr">
    <TextField source="name" />
    <TextField source="description" />
</TranslatableFields>
```

By default, `<TranslatableFields>` will allow users to select the displayed locale using Material-ui tabs with the locale code as their labels.

You may override the tabs labels using translation keys following this format: `ra.locales.[locale_code]`. For instance, `ra.locales.en` or `ra.locales.fr`.

You may override the language selector using the `selector` prop, which accepts a React element:

```jsx
const Selector = () => {
    const {
        locales,
        selectLocale,
        selectedLocale,
    } = useTranslatableContext();

    const handleChange = event => {
        selectLocale(event.target.value);
    };

    return (
        <select
            aria-label="Select the locale"
            onChange={handleChange}
            value={selectedLocale}
        >
            {locales.map(locale => (
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

<TranslatableFields
    record={record}
    resource="products"
    locales={['en', 'fr']}
    selector={<Selector />}
>
    <TextField source="name" />
    <TextField source="description" />
</TranslatableFields>
```

If you have multiple `TranslatableFields` on the same page, you should specify a `groupKey` so that react-admin can create unique identifiers for accessibility.

```jsx
<TranslatableFields locales={['en', 'fr']} groupKey="essential-fields">
    <TextField source="name" />
    <TextField source="description" />
</TranslatableFields>
```

## Using Translatable Fields In List or Show views

The `TranslatableFields` component is not meant to be used inside a `List` as you probably don't want to have tabs inside multiple lines. The simple solution to display a translatable value would be to specify its source like this: `name.en`. However, you may want to display its translation for the current admin locale.

In this case, you'll have to get the current locale through the `useLocale` hook and set the translatable field `source` dynamically.

{% raw %}
```jsx
const PostList = () => {
    const locale = useLocale();

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
