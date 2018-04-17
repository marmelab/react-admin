import React from 'react';
import {
    translate,
    Datagrid,
    Edit,
    EditButton,
    List,
    NumberField,
    ReferenceManyField,
    SimpleForm,
    TextField,
    TextInput,
} from 'react-admin';
import withStyles from 'material-ui/styles/withStyles';
import Icon from '@material-ui/icons/Bookmark';

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
import LinkToRelatedProducts from './LinkToRelatedProducts';

export const CategoryIcon = Icon;

const listStyles = {
    name: { padding: '0 12px 0 25px' },
};

export const CategoryList = withStyles(listStyles)(({ classes, ...props }) => (
    <List {...props} sort={{ field: 'name', order: 'ASC' }}>
        <Datagrid>
            <TextField source="name" className={classes.name} />
            <LinkToRelatedProducts />
            <EditButton />
        </Datagrid>
    </List>
));

const CategoryTitle = translate(({ record, translate }) => (
    <span>
        {translate('resources.categories.name', { smart_count: 1 })} &quot;{record.name}&quot;
    </span>
));

export const CategoryEdit = props => (
    <Edit title={<CategoryTitle />} {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceManyField
                reference="products"
                target="category_id"
                label="resources.categories.fields.products"
                perPage={5}
            >
                <Datagrid>
                    <ThumbnailField />
                    <ProductRefField source="reference" />
                    <NumberField
                        source="price"
                        options={{ style: 'currency', currency: 'USD' }}
                    />
                    <NumberField
                        source="width"
                        options={{ minimumFractionDigits: 2 }}
                    />
                    <NumberField
                        source="height"
                        options={{ minimumFractionDigits: 2 }}
                    />
                    <NumberField source="stock" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);
