import * as React from 'react';
import {
    DataTable,
    Edit,
    EditButton,
    Labeled,
    ReferenceManyField,
    SimpleForm,
    TextInput,
    useDefaultTitle,
    useEditContext,
} from 'react-admin';

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';

const CategoryEdit = () => (
    <Edit title={<CategoryTitle />}>
        <SimpleForm>
            <TextInput source="name" />
            <Labeled label="resources.categories.fields.products" fullWidth>
                <ReferenceManyField
                    reference="products"
                    target="category_id"
                    perPage={20}
                >
                    <DataTable>
                        <DataTable.Col
                            sx={{ width: 25, padding: 0 }}
                            field={ThumbnailField}
                            label={false}
                        />
                        <DataTable.Col
                            source="reference"
                            field={ProductRefField}
                        />
                        <DataTable.NumberCol
                            source="price"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                        <DataTable.NumberCol
                            source="width"
                            options={{ minimumFractionDigits: 2 }}
                        />
                        <DataTable.NumberCol
                            source="height"
                            options={{ minimumFractionDigits: 2 }}
                        />
                        <DataTable.NumberCol source="stock" />
                        <DataTable.NumberCol source="sales" />
                        <DataTable.Col align="right">
                            <EditButton />
                        </DataTable.Col>
                    </DataTable>
                </ReferenceManyField>
            </Labeled>
        </SimpleForm>
    </Edit>
);

const CategoryTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

export default CategoryEdit;
