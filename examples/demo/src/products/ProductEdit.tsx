import * as React from 'react';
import {
    DataTable,
    DateField,
    Edit,
    EditButton,
    Pagination,
    ReferenceManyField,
    ReferenceManyCount,
    required,
    TabbedForm,
    TextInput,
    useDefaultTitle,
    useEditContext,
} from 'react-admin';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ReviewIcon from '@mui/icons-material/Comment';

import { type Review } from '../types';
import { ProductEditDetails } from './ProductEditDetails';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from '../reviews/StarRatingField';
import Poster from './Poster';
import CreateRelatedReviewButton from './CreateRelatedReviewButton';

const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const Column = DataTable.Col<Review>;

const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <TabbedForm>
            <TabbedForm.Tab
                label="resources.products.tabs.image"
                sx={{ maxWidth: '40em', minHeight: 48 }}
                iconPosition="start"
                icon={<PhotoCameraIcon />}
            >
                <Poster />
                <TextInput source="image" validate={req} />
                <TextInput source="thumbnail" validate={req} />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.details"
                path="details"
                sx={{ maxWidth: '40em', minHeight: 48 }}
                iconPosition="start"
                icon={<AspectRatioIcon />}
            >
                <ProductEditDetails />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.products.tabs.description"
                path="description"
                sx={{ maxWidth: '40em', minHeight: 48 }}
                iconPosition="start"
                icon={<EditNoteIcon />}
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
                sx={{ minHeight: 48 }}
                iconPosition="start"
                icon={<ReviewIcon />}
            >
                <ReferenceManyField
                    reference="reviews"
                    target="product_id"
                    pagination={<Pagination />}
                >
                    <DataTable sx={{ width: '100%' }}>
                        <Column source="date" field={DateField} />
                        <Column
                            source="customer_id"
                            field={CustomerReferenceField}
                        />
                        <Column
                            label="resources.reviews.fields.rating"
                            source="rating"
                            field={StarRatingField}
                        />
                        <Column
                            source="comment"
                            sx={{
                                maxWidth: '20em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        />
                        <Column source="status" />
                        <Column align="right">
                            <EditButton />
                        </Column>
                    </DataTable>
                    <CreateRelatedReviewButton />
                </ReferenceManyField>
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);

const req = [required()];

export default ProductEdit;
