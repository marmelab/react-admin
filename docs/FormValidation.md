# Form Validation

## Adding Validation Prop

Validating your forms just consists in adding some `validation` props either to your form components, inputs, or even a mix of both.

Form `validation` props is an object whose keys are the source names of your fields and values are constraints objects (see [Constraints Reference](#constraints-reference) below):

``` js
<Create
    {...props}
    validation={{
        title: { required: true },
        teaser: { required: true },
        average_note: { min: 0, max: 5 },
    }}
>
    <TextInput label="Title" source="title" />
    <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
    <TextInput label="Average note" source="average_note" />
</Create>
```

If you want to add a constraint on a given field, just pass a constraint object to your input. For instance, the previous example becomes:

``` js
<Create {...props}>
    <TextInput label="Title" source="title" validation={{ required: true }} />
    <TextInput label="Teaser" source="teaser" validation={{ required: true }} />
    <TextInput label="Average note" source="average_note" validation={{ min: 0, max: 5 }}/>
</Create>
```

If two kinds of validation are used, they will be merged and applied both.

## Constrains Reference

Here are all available validation constraints you can use:

* **required:** *(boolean)* is the field mandatory?
* **min:** *(Number)* minimum allowed value
* **max:** *(Number)* maximum allowed value
* **custom:** *(function)* function taking current field value and the whole record as arguments and returning an error message or an empty string.
