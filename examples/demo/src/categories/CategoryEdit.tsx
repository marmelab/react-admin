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

import { type Product } from '../types';
import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';

const Column = DataTable.Col<Product>;
const ColumnNumber = DataTable.NumberCol<Product>;

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
                        <Column
                            sx={{ width: 25, padding: 0 }}
                            field={ThumbnailField}
                            label={false}
                        />
                        <Column source="reference" field={ProductRefField} />
                        <ColumnNumber
                            source="price"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                        <ColumnNumber
                            source="width"
                            options={{ minimumFractionDigits: 2 }}
                        />
                        <ColumnNumber
                            source="height"
                            options={{ minimumFractionDigits: 2 }}
                        />
                        <ColumnNumber source="stock" />
                        <ColumnNumber source="sales" />
                        <Column align="right">
                            <EditButton />
                        </Column>
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
