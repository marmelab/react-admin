import * as React from 'react';
import {
    BulkDeleteButton,
    DataTable,
    DateField,
    Identifier,
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
        <DataTable
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
                '& .RaDataTable-thead': {
                    borderLeftColor: 'transparent',
                    borderLeftWidth: 5,
                    borderLeftStyle: 'solid',
                },
            }}
        >
            <DataTable.Col source="date" field={DateField} />
            <DataTable.Col source="customer_id">
                <CustomerReferenceField source="customer_id" link={false} />
            </DataTable.Col>
            <DataTable.Col source="product_id">
                <ProductReferenceField source="product_id" link={false} />
            </DataTable.Col>
            <DataTable.Col
                source="rating"
                label="resources.reviews.fields.rating"
            >
                <StarRatingField />
            </DataTable.Col>
            <DataTable.Col
                source="comment"
                sx={{
                    maxWidth: '18em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            />
            <DataTable.Col source="status" />
        </DataTable>
    );
};

export default ReviewListDesktop;
