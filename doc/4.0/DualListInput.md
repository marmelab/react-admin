---
layout: default
title: "The DualListInput Component"
---

# `<DualListInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to edit array values, one-to-many or many-to-many relationships by moving items from one list to another. It's a good alternative to `<SelectInput>` for a small number of choices.

![DualListInput](https://marmelab.com/ra-enterprise/modules/assets/ra-relationships-duallistinput.gif)

```jsx
import { ReferenceInput } from 'react-admin';
import { DualListInput } from '@react-admin/ra-relationships';

<ReferenceInput label="Author" source="author_id" reference="authors">
    <DualListInput optionText="last_name" />
</ReferenceInput>
```

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships) for more details.
