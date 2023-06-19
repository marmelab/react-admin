---
layout: default
title: "The TimeInput Component"
---

# `<TimeInput>`

An input for editing time. `<TimeInput>` renders a standard browser [Time Picker](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time), so the appearance depends on the browser.

<table>
  <thead>
    <tr>
      <th>Firefox</th>
      <th>Edge</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <video controls autoplay playsinline muted loop>
          <source src="./img/time-input-firefox.webm" type="video/webm"/>
          <source src="./img/time-input-firefox.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </td>
      <td>
        <video controls autoplay playsinline muted loop>
          <source src="./img/time-input-edge.webm" type="video/webm"/>
          <source src="./img/time-input-edge.mp4" type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </td>
    </tr>
  </tbody>
</table>

This component works with Date objects to handle the timezone using the browser locale.
You can still pass string values as long as those can be converted to a JavaScript Date object.

## Usage

```jsx
import { TimeInput } from 'react-admin';

<TimeInput source="published_at" />
```

**Tip**: For a Material UI styled `<TimeInput>` component, check out [vascofg/react-admin-date-inputs](https://github.com/vascofg/react-admin-date-inputs).

## Props

`<TimeInput>` accepts the [common input props](./Inputs.md#common-input-props).

