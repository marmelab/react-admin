---
layout: default
title: "The BooleanInput Component"
---

# `<BooleanInput>`

`<BooleanInput />` is a toggle button allowing you to attribute a `true` or `false` value to a record field.

```jsx
import { BooleanInput } from 'react-admin';

<BooleanInput label="Commentable" source="commentable" />
```

![BooleanInput](./img/boolean-input.png)

This input does not handle `null` values. You would need the [`<NullableBooleanInput />`](./NullableBooleanInput.md) component if you have to handle non-set booleans.

You can use the `options` prop to pass any option supported by the MUI's `Switch` components. For example, here's how to set a custom checked icon:

{% raw %}
```jsx
import { BooleanInput } from 'react-admin';
import FavoriteIcon from '@mui/icons-material/Favorite';

<BooleanInput source="favorite" options={{ checkedIcon: <FavoriteIcon /> }} />
```
{% endraw %}

![CustomBooleanInputCheckIcon](./img/custom-switch-icon.png)

Refer to [MUI Switch documentation](https://mui.com/api/switch) for more details.

`<BooleanInput>` also accepts the [common input props](./Inputs.md#common-input-props).
