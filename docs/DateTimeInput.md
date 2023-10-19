---
layout: default
title: "The DateTimeInput Component"
---

# `<DateTimeInput>`

An input for editing dates with time. `<DateTimeInput>` renders an `<input type="datetime-local" >` element, that most browsers display as [date and time picker](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local).

<video controls autoplay playsinline muted loop>
  <source src="./img/date-time-input.webm" type="video/webm"/>
  <source src="./img/date-time-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The appearance depends on the browser, and falls back to a text input on safari. The date formatting in this input depends on the user's locale.

## Usage

```jsx
import { DateTimeInput } from 'react-admin';

<DateTimeInput source="published_at" />
```

The input value must be a valid date string, i.e. a string understood by JavasSript's [`Date.parse()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse), or a `Date` object. Strings with [the ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) 'yyyy-MM-ddThh:mm' are the most common (e.g. `'2022-04-30T12:30'`). The field value may contain a timezone offset, e.g. `'2022-04-30T12:30+02:00'`. If no timezone is specified, the browser's timezone is used.

After modification by the user, the value is stored as a `Date` object, using the browser's timezone. When transformed to JSON, the date is serialized as a string in the ISO 8601 format ('yyyy-MM-ddThh:mm').

**Tip**: For a Material UI styled `<DateTimeInput>` component, check out [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)

## Props

`<DateTimeInput>` accepts the [common input props](./Inputs.md#common-input-props).

## Custom `format` and `parse`

Internally, `<DateTimeInput>` renders an [`<input type="datetime-local">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local).

If you need to implement your own `format` and `parse` functions, make sure the **format** function actually formats the input into [a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#local_date_and_time_strings).