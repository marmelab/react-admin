import * as React from 'react';
import {
    Datagrid,
    DateField,
    Edit,
    EditButton,
    Pagination,
    ReferenceManyField,
    ReferenceManyCount,
    required,
    TabbedForm,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';

import { ProductEditDetails } from './ProductEditDetails';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import Poster from './Poster';
import { Product } from '../types';
import CreateRelatedReviewButton from './CreateRelatedReviewButton';

const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const record = useRecordContext<Product>();
    return record ? <span>Poster "{record.reference}"</span> : null;
};

const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <TabbedForm.Tab
                label="resources.products.tabs.image"
                sx={{ maxWidth: '40em' }}
            >
                <Poster />
                <TextInput source="image" fullWidth validate={req} />
                <TextInput source="thumbnail" fullWidth validate={req} />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.details"
                path="details"
                sx={{ maxWidth: '40em' }}
            >
                <ProductEditDetails />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.description"
                path="description"
                sx={{ maxWidth: '40em' }}
            >
                <RichTextInput source="description" label="" validate={req} />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.reviews"
                count={
                    <ReferenceManyCount
                        reference="reviews"
                        target="product_id"
                        sx={{ lineHeight: 'inherit' }}
                    />
                }
                path="reviews"
            >
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
                    <CreateRelatedReviewButton />
                </ReferenceManyField>
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);

const req = [required()];

export default ProductEdit;
