import * as React from 'react';
import {
    Datagrid,
    DateField,
    Edit,
    EditButton,
    FormTab,
    Pagination,
    ReferenceManyField,
    required,
    TabbedForm,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

import { ProductEditDetails } from './ProductEditDetails';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import Poster from './Poster';
import { Product } from '../types';

const ProductTitle = () => {
    const record = useRecordContext<Product>();
    return record ? <span>Poster "{record.reference}"</span> : null;
};

const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <FormTab
                label="resources.products.tabs.image"
                sx={{ maxWidth: '40em' }}
            >
                <Poster />
                <TextInput source="image" fullWidth validate={req} />
                <TextInput source="thumbnail" fullWidth validate={req} />
            </FormTab>
            <FormTab
                label="resources.products.tabs.details"
                path="details"
                sx={{ maxWidth: '40em' }}
            >
                <ProductEditDetails />
            </FormTab>
            <FormTab
                label="resources.products.tabs.description"
                path="description"
                sx={{ maxWidth: '40em' }}
            >
                <RichTextInput source="description" label="" validate={req} />
            </FormTab>
            <FormTab label="resources.products.tabs.reviews" path="reviews">
                <ReferenceManyField
                    reference="reviews"
                    target="product_id"
                    pagination={<Pagination />}
                >
                    <Datagrid
                        sx={{
                            width: '100%',
                            '& .column-comment': {
                                maxWidth: '20em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                        }}
                    >
                        <DateField source="date" />
                        <CustomerReferenceField />
                        <StarRatingField />
                        <TextField source="comment" />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>
);

const req = [required()];

export default ProductEdit;
