---
layout: default
title: "The NumberField Component"
---

# `<NumberField>`

Displays a number formatted according to the browser locale, right aligned.

```jsx
import { NumberField }  from 'react-admin';

<NumberField source="score" />
// renders the record { id: 1234, score: 567 } as
<span>567</span>
```

## Properties

| Prop      | Required | Type   | Default | Description                                                                                              |
| --------- | -------- | ------ | ------- | -------------------------------------------------------------------------------------------------------- |
| `locales` | Optional | string | ''      | Override the browser locale in the date formatting. Passed as first argument to `Intl.NumberFormat()`.   |
| `options` | Optional | Object | -       | Number formatting options. Passed as second argument to `Intl.NumberFormat()`.                           |

`<NumberField>` also accepts the [common field props](./Fields.md#common-field-props).

## Usage

`<NumberField>` uses `Intl.NumberFormat()` if available, passing the `locales` and `options` props as arguments. This allows a perfect display of decimals, currencies, percentages, etc. See [Intl.NumberFormat documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) for the `options` prop syntax.

If Intl is not available, `<NumberField>` outputs numbers as is (and ignores the `locales` and `options` props).

{% raw %}
```jsx
import { NumberField }  from 'react-admin';

<NumberField source="score" options={{ maximumFractionDigits: 2 }}/>
// renders the record { id: 1234, score: 567.3567458569 } as
<span>567.35</span>

<NumberField source="share" options={{ style: 'percent' }} />
// renders the record { id: 1234, share: 0.2545 } as
<span>25%</span>

<NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
// renders the record { id: 1234, price: 25.99 } as
<span>$25.99</span>

<NumberField source="price" locales="fr-FR" options={{ style: 'currency', currency: 'USD' }} />
// renders the record { id: 1234, price: 25.99 } as
<span>25,99 $US</span>
```
{% endraw %}

**Tip**: If you need more formatting options than what `Intl.NumberFormat` can provide, build your own field component leveraging a third-party library like [numeral.js](http://numeraljs.com/).

**Tip**: When used in a `Show` view, the right alignment may look weird. Disable it by setting the `textAlign` attribute to "left":

```jsx
import { NumberField }  from 'react-admin';

<NumberField source="score" textAlign="left" />
```
