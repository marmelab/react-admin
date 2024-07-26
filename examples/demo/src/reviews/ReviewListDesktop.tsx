import * as React from 'react';
import {
    BulkDeleteButton,
    DatagridConfigurable,
    DateField,
    Identifier,
    TextField,
    useCreatePath,
} from 'react-admin';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import rowSx from './rowSx';

import BulkAcceptButton from './BulkAcceptButton';
import BulkRejectButton from './BulkRejectButton';
import { useNavigate } from 'react-router';

export interface ReviewListDesktopProps {
    selectedRow?: Identifier;
}

const ReviewsBulkActionButtons = () => (
    <>
        <BulkAcceptButton />
        <BulkRejectButton />
        <BulkDeleteButton />
    </>
);

const ReviewListDesktop = ({ selectedRow }: ReviewListDesktopProps) => {
    const navigate = useNavigate();
    const createPath = useCreatePath();
    return (
        <DatagridConfigurable
            rowClick={(id, resource) => {
                // As we display the edit view in a drawer, we don't the default rowClick behavior that will scroll to the top of the page
                // So we navigate manually without specifying the _scrollToTop state
                navigate(
                    createPath({
                        resource,
                        id,
                        type: 'edit',
                    })
                );
                // Disable the default rowClick behavior
                return false;
            }}
            rowSx={rowSx(selectedRow)}
            bulkActionButtons={<ReviewsBulkActionButtons />}
            sx={{
                '& .RaDatagrid-thead': {
                    borderLeftColor: 'transparent',
                    borderLeftWidth: 5,
                    borderLeftStyle: 'solid',
                },
                '& .column-comment': {
                    maxWidth: '18em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
            }}
        >
            <DateField source="date" />
            <CustomerReferenceField source="customer_id" link={false} />
            <ProductReferenceField source="product_id" link={false} />
            <StarRatingField
                size="small"
                label="resources.reviews.fields.rating"
                source="rating"
            />
            <TextField source="comment" />
            <TextField source="status" />
        </DatagridConfigurable>
    );
};

export default ReviewListDesktop;
