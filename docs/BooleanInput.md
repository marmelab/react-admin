---
layout: default
title: "The BooleanInput Component"
---

# `<BooleanInput>`

`<BooleanInput />` renders a switch allowing users to set the value `true` or `false` to a record field.

<video controls autoplay playsinline muted loop>
  <source src="./img/boolean-input.webm" type="video/webm"/>
  <source src="./img/boolean-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


**Tip**: This input doesn't let users set a `null` value - only `true` or `false`. Use the [`<NullableBooleanInput />`](./NullableBooleanInput.md) component if you have to handle non-required booleans.

## Usage 

```jsx
import { BooleanInput } from 'react-admin';

<BooleanInput label="Commentable" source="commentable" />
```

## Props

| Prop      | Required | Type     | Default | Description                                                                |
|-----------|----------|----------|---------|----------------------------------------------------------------------------|
| `options` | Optional | `Object` | `{}`    | Options object to pass to the underlying material-ui `<Switch>` component. |

`<BooleanInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `options`

Use the `options` prop to pass any option supported by the Material UI's `Switch` components. For example, here's how to set a custom checked icon:

{% raw %}
```jsx
import { BooleanInput } from 'react-admin';
import FavoriteIcon from '@mui/icons-material/Favorite';

<BooleanInput source="favorite" options={{ checkedIcon: <FavoriteIcon /> }} />
```
{% endraw %}

![CustomBooleanInputCheckIcon](./img/custom-switch-icon.png)

Refer to [Material UI Switch documentation](https://mui.com/material-ui/api/switch/) for more details.
