---
layout: default
title: "The TreeWithDetails Component"
---

# `<TreeWithDetails>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers a replacement for the `<List>` component when the records form **tree structures** like directories, categories, etc. `<TreeWithDetails>` renders a tree structure and the show view/edition form in the same page.

<video controls autoplay playsinline muted loop>
  <source src="./img/treewithdetails.webm" type="video/webm"/>
  <source src="./img/treewithdetails.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


This component allows users to browse, edit, and rearrange trees.

## Usage

```jsx
// in src/category.js
import {
    Admin,
    Resource,
    Create,
    Edit,
    SimpleForm,
    TextInput,
} from 'react-admin';
import {
    CreateNode,
    EditNode,
    EditNodeToolbar,
    TreeWithDetails,
} from '@react-admin/ra-tree';

// a Create view for a tree uses <CreateNode> instead of the standard <Create>
const CategoriesCreate = () => (
    <CreateNode>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </CreateNode>
);

// an Edit view for a tree uses <EditNode> instead of the standard <Edit>
const CategoriesEdit = () => (
    <EditNode>
        <SimpleForm toolbar={<EditNodeToolbar />}>
            <TextInput source="title" />
        </SimpleForm>
    </EditNode>
);

// a List view for a tree uses <TreeWithDetails>
export const CategoriesList = () => (
    <TreeWithDetails create={CategoriesCreate} edit={CategoriesEdit} />
);

// in src/App.js
import { CategoriesList } from './category';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource list={CategoriesList} />
    </Admin>
);
```

Check [the `ra-tree` documentation](https://marmelab.com/ra-enterprise/modules/ra-tree#treewithdetails-component) for more details.

## Selecting a Node

If you need to let users select a node in a tree, use the [`<TreeInput>`](./TreeInput.md) component.

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

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>