import * as React from 'react';
import {
    Datagrid,
    Edit,
    EditButton,
    NumberField,
    ReferenceManyField,
    SimpleForm,
    TextInput,
    useTranslate,
    useRecordContext,
} from 'react-admin';

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
import { Category } from '../types';

const CategoryTitle = () => {
    const record = useRecordContext<Category>();
    const translate = useTranslate();

    return record ? (
        <span>
            {translate('resources.categories.name', { smart_count: 1 })} &quot;
            {record.name}&quot;
        </span>
    ) : null;
};

const CategoryEdit = () => (
    <Edit title={<CategoryTitle />}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceManyField
                reference="products"
                target="category_id"
                label="resources.categories.fields.products"
                perPage={20}
                fullWidth
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
                    <NumberField source="sales" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    </Edit>
);

export default CategoryEdit;
