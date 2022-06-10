---
layout: default
title: "The TreeWithDetails Component"
---

# `<TreeWithDetails>`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component offers a replacement for the `<List>` component when the records form **tree structures** like directories, categories, etc. `<TreeWithDetails>` renders a tree structure and the show view/edition form in the same page.

![TreeWithDetails](./img/treewithdetails.gif)

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
