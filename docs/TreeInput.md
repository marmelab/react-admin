---
layout: default
title: "The TreeInput Component"
---

# `<TreeInput>` Component

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component allows to select one or several nodes from a tree.

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Use `<TreeInput>` in a react-admin form, and pass the possible choices as the `treeData` prop . It must be an array of nodes with a `children` field.

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { TreeInput } from '@react-admin/ra-tree';

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <TreeInput source="category" treeData={[
                { id: 1, title: 'Clothing', isRoot: true, children: [2, 6] },
                { id: 2, title: 'Men', children: [3] },
                { id: 3, title: 'Suits', children: [4, 5] },
                { id: 4, title: 'Slacks', children: [] },
                { id: 5, title: 'Jackets', children: [] },
                { id: 6, title: 'Women', children: [7, 10, 11] },
                { id: 7, title: 'Dresses', children: [8, 9] },
                { id: 8, title: 'Evening Gowns', children: [] },
                { id: 9, title: 'Sun Dresses', children: [] },
                { id: 10, title: 'Skirts', children: [] },
                { id: 11, title: 'Blouses', children: [] },
            ]} />
        </SimpleForm>
    </Edit>
);
```

**Tip:** You can use the `<TreeInput>` component in a [`<ReferenceNodeInput>`](./ReferenceNodeInput.md) to automatically fetch the `treeData` from a reference resource.

`<TreeInput>` uses rc-tree's [`<Tree>` component](https://tree-react-component.vercel.app/#tree-props) under the hood, and accepts all its props.

## Props

| Prop              | Required     | Type             | Default   | Description                                                                               |
| ----------------- | ------------ | ---------------- | --------- | ----------------------------------------------------------------------------------------- |
| `source`          | Required     | string           | -         | The name of the source field. Required unless when used inside `<ReferenceNodeInput>` |
| `treeData`        | Required     | array of objects | -         | The tree data                                                                             |
| `multiple`        | Optional     | boolean          | `false`   | Set to true to allow selecting multiple nodes                                             |
| `hideRootNodes`   | Optional     | boolean          | `false`   | Set to true to hide all root nodes                                                        |
| `titleField`      | Optional     | string           | `'title'` | The name of the field holding the node title                                              |

`<TreeInput>` also accepts the [common input props](./Inputs.md#common-input-props) and the [rc-tree](https://tree-react-component.vercel.app/) props.

## `checkStrictly`

By default, `<TreeInput>` uses the `checkStrictly` prop from rc-tree's [`<Tree>` component](https://tree-react-component.vercel.app/#tree-props) to allow selecting leaf and parent nodes independently. If you want to disable this feature, you can set the `checkStrictly` prop to `false`:

```tsx
<TreeInput 
    source="category" 
    treeData={treeData} 
    multiple 
    checkStrictly={false} 
/>
```

## `hideRootNodes`

Use the `hideRootNodes` prop to hide all root nodes:

```tsx
<TreeInput 
    source="category" 
    treeData={treeData} 
    hideRootNodes
/>
```

## `multiple`

Use the `multiple` prop to allow selecting multiple nodes. In that case, `<TreeInput>` renders a tree with one checkbox per line.

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-multiple.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-multiple.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


```tsx
import { SimpleForm } from 'react-admin';
import { TreeInput } from '@react-admin/ra-tree';
import treeData from './treeData';

export const SimpleTreeForm = () => (
    <SimpleForm>
        <TreeInput source="category" treeData={treeData} multiple />
    </SimpleForm>
);
```

## `titleField`

Use the `titleField` prop to specify the name of the field holding the node title:

```tsx
<TreeInput 
    source="category" 
    treeData={treeData} 
    titleField="name" 
/>
```

## `treeData`

The list of possible choices must be passed as the `treeData` prop. It must be an array of nodes with a `children` field.

```tsx
<TreeInput source="category" treeData={[
    { id: 1, title: 'Clothing', isRoot: true, children: [2, 6] },
    { id: 2, title: 'Men', children: [3] },
    { id: 3, title: 'Suits', children: [4, 5] },
    { id: 4, title: 'Slacks', children: [] },
    { id: 5, title: 'Jackets', children: [] },
    { id: 6, title: 'Women', children: [7, 10, 11] },
    { id: 7, title: 'Dresses', children: [8, 9] },
    { id: 8, title: 'Evening Gowns', children: [] },
    { id: 9, title: 'Sun Dresses', children: [] },
    { id: 10, title: 'Skirts', children: [] },
    { id: 11, title: 'Blouses', children: [] },
]} />
```

If you need to fetch the `treeData`, you're probably editing a relationship. In that case, you should use the [`<ReferenceNodeInput>`](./ReferenceNodeInput.md) component, which fetches the `treeData` from a reference resource on mount .

## Fetching Choices

You can use `dataProvider.getTree()` to fetch choices. For example, to fetch a list of categories for a product:

```tsx
import { useGetTree, TreeInput } from '@react-admin/ra-tree';

const CategoryInput = () => {
    const { isLoading, data: tree } = useGetTree('categories');
    if (isLoading) return <Loading />;
    return (
        <TreeInput 
            source="category" 
            treeData={tree} 
        />
    );
};
```

The `isLoading` prop is used to display a loading indicator while the data is being fetched.

However, most of the time, if you need to populate a `<TreeInput>` with choices fetched from another resource, it's because you are trying to set a foreign key. In that case, you should use [`<ReferenceNodeInput>`](./ReferenceNodeInput.md) to fetch the choices instead (see next section). 

## Selecting a Foreign Key

If you use `<TreeInput>` to set a foreign key for a many-to-one or a one-to-one relationship, you’ll have to [fetch choices](#fetching-choices), as explained in the previous section.

As this is a common task, react-admin provides a shortcut to do the same in a declarative way: [`<ReferenceNodeInput>`](./ReferenceNodeInput.md):

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { ReferenceNodeInput, TreeInput } from '@react-admin/ra-tree';

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceNodeInput source="category_id" reference="categories">
                <TreeInput />
            </ReferenceNodeInput>
        </SimpleForm>
    </Edit>
);
```

