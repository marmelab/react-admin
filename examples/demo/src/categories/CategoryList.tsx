import React from 'react';
import { Datagrid, EditButton, List, TextField } from 'react-admin';

import LinkToRelatedProducts from './LinkToRelatedProducts';

const CategoryList = (props: any) => (
    <List {...props} sort={{ field: 'name', order: 'ASC' }}>
        <Datagrid>
            <TextField source="name" />
            <LinkToRelatedProducts />
            <EditButton />
        </Datagrid>
    </List>
);

export default CategoryList;
