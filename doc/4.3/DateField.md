---
layout: default
title: "The DateField Component"
---

# `<DateField>`

Displays a date, datetime or time using the browser locale (thanks to `Date.toLocaleDateString()`, `Date.toLocaleString()` and `Date.toLocaleTimeString()`).

```jsx
import { DateField } from 'react-admin';

<DateField source="publication_date" />
```

## Properties

| Prop       | Required | Type    | Default | Description                                                                                              |
| ---------- | -------- | ------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `locales`  | Optional | string  | ''      | Override the browser locale in the date formatting. Passed as first argument to `Intl.DateTimeFormat()`. |
| `options`  | Optional | Object  | -       | Date formatting options. Passed as second argument to `Intl.DateTimeFormat()`.                           |
| `showTime` | Optional | boolean | `false` | If true, show the time                                         |
| `showDate` | Optional | boolean | `true` | If true, show the date                                          |


`<DateField>` also accepts the [common field props](./Fields.md#common-field-props).

## Usage

This component accepts `showTime` and `showDate` props to decide whether to display a date (`showTime=false` and `showDate=true`), a datetime (`showTime=true` and `showDate=true`) or time (`showTime=true` and `showDate=false`). Setting `showTime` and `showDate` to false at the same time will throw and error. It uses `Intl.DateTimeFormat()` if available, passing the `locales` and `options` props as arguments. If Intl is not available, it ignores the `locales` and `options` props.

{% raw %}
```jsx
<DateField source="publication_date" />
// renders the record { id: 1234, publication_date: new Date('2017-04-23') } as
<span>4/23/2017</span>

<DateField source="publication_date" showTime />
// renders the record { id: 1234, publication_date: new Date('2017-04-23 23:05') } as
<span>4/23/2017, 11:05:00 PM</span>

<DateField source="publication_date" showTime showDate={false} />
// renders the record { id: 1234, publication_date: new Date('2017-04-23 23:05') } as
<span>11:05:00 PM</span>

<DateField source="publication_date" showTime={false} showDate={false} />
// throws an error as nothing would be displayed

<DateField source="publication_date" options={{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }} />
// renders the record { id: 1234, publication_date: new Date('2017-04-23') } as
<span>Sunday, April 23, 2017</span>

<DateField source="publication_date" locales="fr-FR" />
// renders the record { id: 1234, publication_date: new Date('2017-04-23') } as
<span>23/04/2017</span>
```
{% endraw %}

See [Intl.DateTimeFormat documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) for the `options` prop syntax.

**Tip**: If you need more formatting options than what `Intl.DateTimeFormat` can provide, build your own field component leveraging a third-party library like [moment.js](https://momentjs.com/).
