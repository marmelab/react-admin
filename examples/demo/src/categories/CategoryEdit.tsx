import * as React from 'react';
import {
    Datagrid,
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
                    <Datagrid
                        sx={{
                            '& .column-thumbnail': {
                                width: 25,
                                padding: 0,
                            },
                        }}
                    >
                        <ThumbnailField source="thumbnail" label="" />
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
