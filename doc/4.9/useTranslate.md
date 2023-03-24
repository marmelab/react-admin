---
layout: default
title: "useTranslate"
---

# `useTranslate`

If you need to translate messages in your own components, React-admin provides a `useTranslate` hook, which returns the `translate` function.

## Syntax

```jsx
const translate = useTranslate();
const translatedMessage = translate(translationKey, options);
```

## Usage

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

## Using Pluralization and Interpolation

Polyglot.js provides some nice features such as interpolation and pluralization, that you can use in react-admin.

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
