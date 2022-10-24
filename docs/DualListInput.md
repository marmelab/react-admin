---
layout: default
title: "The DualListInput Component"
---

# `<DualListInput>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to edit array values, one-to-many or many-to-many relationships by moving items from one list to another. It's a good alternative to [`<SelectArrayInput>`](./SelectArrayInput.md) for a small number of choices.

![DualListInput](https://marmelab.com/ra-enterprise/modules/assets/ra-relationships-duallistinput.gif)

## Usage

```jsx
import { ReferenceArrayInput } from "react-admin";
import { DualListInput } from "@react-admin/ra-relationships";

<ReferenceArrayInput label="Authors" source="authors_ids" reference="authors">
  <DualListInput optionText="last_name" />
</ReferenceArrayInput>;
```

Check [the `ra-relationships` documentation](https://marmelab.com/ra-enterprise/modules/ra-relationships) for more details.
