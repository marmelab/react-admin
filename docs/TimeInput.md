---
layout: default
title: "The TimeInput Component"
---

# `<TimeInput>`

An input for editing time. `<TimeInput>` renders a standard browser [Time Picker](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time), so the appearance depends on the browser.

| Firefox | Edge |
| ------- | ---- |
| <video controls autoplay muted loop>
  <source src="./img/time-input-firefox.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
 | <video controls autoplay muted loop>
  <source src="./img/time-input-edge.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
 |

This component works with Date objects to handle the timezone using the browser locale.
You can still pass string values as long as those can be converted to a JavaScript Date object.

## Usage

```jsx
import { TimeInput } from 'react-admin';

<TimeInput source="published_at" />
```

**Tip**: For a MUI styled `<TimeInput>` component, check out [vascofg/react-admin-date-inputs](https://github.com/vascofg/react-admin-date-inputs).

## Props

`<TimeInput>` accepts the [common input props](./Inputs.md#common-input-props).

