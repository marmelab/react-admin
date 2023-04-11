---
layout: default
title: "JsonSchemaForm"
---

# `<JsonSchemaForm>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to render a form from a JSON Schema description based on [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form).

For instance, to generate the following form:

![JsonSchemaForm](https://marmelab.com/ra-enterprise/modules/assets/jsonschemaform.webp)

Configure the `<Edit>` view with a `<JsonSchemaForm>` child as follows:

{% raw %}
```jsx
import { Edit } from "react-admin";
import { JsonSchemaForm } from "@react-admin/ra-json-schema-form";

const CustomerEdit = () => (
  <Edit>
    <JsonSchemaForm
      schema={{
        type: "object",
        properties: {
          id: { type: "number" },
          first_name: { type: "string", title: "First name" },
          last_name: { type: "string", minLength: 3 },
          dob: { type: "string", format: "date" },
          sex: { type: "string", enum: ["male", "female"] },
          employer_id: { type: "number" },
          occupations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                from: { type: "string", format: "date" },
                to: { type: "string", format: "date" },
              },
            },
          },
        },
        required: ["id", "last_name", "employer_id"],
      }}
      uiSchema={{
        id: { "ui:disabled": true },
        employer_id: {
          "ui:widget": "reference",
          "ui:options": {
            reference: "employers",
            optionText: "name",
          },
        },
      }}
      onChange={(change) =>
        process.env.NODE_ENV !== "test" && console.log("changed", change)
      }
      onError={(error) =>
        process.env.NODE_ENV !== "test" && console.log("error", error)
      }
    />
  </Edit>
);
```
{% endraw %}

Check [the `ra-json-schema-form` documentation](https://marmelab.com/ra-enterprise/modules/ra-json-schema-form#installation) for more details.

