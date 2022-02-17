---
layout: default
title: "The DateTimeInput Component"
---

# `<DateTimeInput>`

An input for editing dates with time. `<DateTimeInput>` renders a standard browser [Date and Time Picker](https://material-ui.com/components/pickers/#date-amp-time-pickers), so the appearance depends on the browser (and falls back to a text input on safari).

![DateTimeInput](./img/date-time-input.gif)

```jsx
import { DateTimeInput } from 'react-admin';

<DateTimeInput source="published_at" />
```

`<DateTimeInput>` also accepts the [common input props](./Inputs.md#common-input-props).

**Tip**: For a material-ui styled `<DateTimeInput>` component, check out [vascofg/react-admin-date-inputs](https://github.com/vascofg/react-admin-date-inputs).
