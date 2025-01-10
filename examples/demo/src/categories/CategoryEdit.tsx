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
    useTranslate,
    useRecordContext,
    useDefaultTitle,
    useGetResourceLabel,
} from 'react-admin';

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
import { Category } from '../types';

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
    const record = useRecordContext<Category>();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const pageTitle = translate('ra.page.edit', {
        name: getResourceLabel('categories', 1),
        recordRepresentation: `"${record?.name}"`,
    });

    return record ? (
        <>
            <title>{`${appTitle} - ${pageTitle}`}</title>
            <span>{pageTitle}</span>
        </>
    ) : null;
};

export default CategoryEdit;
