---
layout: default
title: "The DateInput Component"
---

# `<DateInput>`

Ideal for editing dates, `<DateInput>` renders an HTML `<input type="date">` element, that most browsers display as a standard [Date Picker](https://mui.com/components/pickers/#date-pickers).

![DateInput](./img/date-input.gif)

The appearance of `<DateInput>` depends on the browser, and falls back to a text input on Safari. The date formatting in this input depends on the user's locale.

```jsx
import { DateInput } from 'react-admin';

<DateInput source="published_at" />
```

`<DateInput>` also accepts the [common input props](./Inputs.md#common-input-props).

**Tip**: For a MUI styled `<DateInput>` component, check out [vascofg/react-admin-date-inputs](https://github.com/vascofg/react-admin-date-inputs).

![MUI style DateInput](https://github.com/vascofg/react-admin-date-inputs/raw/master/date-time-picker.gif)
