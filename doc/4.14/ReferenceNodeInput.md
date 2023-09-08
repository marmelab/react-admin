---
layout: default
title: "The ReferenceNodeInput Component"
---

# `<ReferenceNodeInput>` Component

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows users to select one or several nodes from a tree of a reference resource. For instance, this is useful to select a category for a product.

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Use `<ReferenceNodeInput>` in a react-admin form, and set the `reference` and `source` props just like for a `<ReferenceInput>`.

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { ReferenceNodeInput } from '@react-admin/ra-tree';

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceNodeInput
                source="category_id"
                reference="categories"
            />
        </SimpleForm>
    </Edit>
);
```

`<ReferenceNodeInput>` is a controller component, i.e. it fetches the tree from the reference resource, creates a tree choices context, and renders its child component.

By default `<ReferenceNodeInput>` will render a simple [`<TreeInput>`](./TreeInput.md) as its child. If you need to customize the `<TreeInput>` props, e.g. set the `multiple` prop, you will need to pass the child explicitly:

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { ReferenceNodeInput, TreeInput } from '@react-admin/ra-tree';

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceNodeInput
                source="category_id"
                reference="categories"
            >
                <TreeInput multiple />
            </ReferenceNodeInput>
        </SimpleForm>
    </Edit>
);
```

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-multiple.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-multiple.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Props

| Prop              | Required     | Type             | Default         | Description                                                                               |
| ----------------- | ------------ | ---------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `reference`       | Required     | string           | -               | The reference resource                                                                    |
| `source`          | Required     | string           | -               | The name of the source field                                                              |
| `children`        | Optional     | React Element    | `<TreeInput>` | The child component responsible for rendering the input                                   |
| `meta`            | Optional     | object           | -               | An object containing metadata to be passed when calling the dataProvider                  |

## `children`

`<ReferenceNodeInput>` accepts only one child, which is responsible for rendering the input. By default, it renders a simple `<TreeInput>` with no props. If you need to pass additional props to `<TreeInput>`, you will need to pass them explicitely:

```tsx
<ReferenceNodeInput source="category_id" reference="categories">
    <TreeInput multiple checkStrictly={false} />
</ReferenceNodeInput>
```

## `meta`

Use the `meta` prop to pass metadata to the dataProvider when calling `getTree()`:

{% raw %}
```tsx
<ReferenceNodeInput 
    source="category_id" 
    reference="categories" 
    meta={{ foo: 'bar' }}
/>
```
{% endraw %}

## `reference`

Use the `reference` prop to specify the reference resource:

```tsx
<ReferenceNodeInput source="category_id" reference="categories" />
```

## `source`

Use the `source` prop to specify the name of the source field:

```tsx
<ReferenceNodeInput source="category_id" reference="categories" />
```
