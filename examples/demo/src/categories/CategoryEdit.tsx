import * as React from 'react';
import {
    DataTable,
    Edit,
    EditButton,
    NumberField,
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
                        <DataTable.Col sx={{ width: 25, padding: 0 }}>
                            <ThumbnailField source="thumbnail" label="" />
                        </DataTable.Col>
                        <DataTable.Col source="reference">
                            <ProductRefField source="reference" />
                        </DataTable.Col>
                        <DataTable.Col source="price" align="right">
                            <NumberField
                                source="price"
                                options={{ style: 'currency', currency: 'USD' }}
                            />
                        </DataTable.Col>
                        <DataTable.Col source="width" align="right">
                            <NumberField
                                source="width"
                                options={{ minimumFractionDigits: 2 }}
                            />
                        </DataTable.Col>
                        <DataTable.Col source="height" align="right">
                            <NumberField
                                source="height"
                                options={{ minimumFractionDigits: 2 }}
                            />
                        </DataTable.Col>
                        <DataTable.NumberCol source="stock" />
                        <DataTable.NumberCol source="sales" />
                        <DataTable.Col sx={{ textAlign: 'right' }}>
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
