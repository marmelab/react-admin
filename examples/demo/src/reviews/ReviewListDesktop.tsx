import * as React from 'react';
import {
    BulkDeleteButton,
    DataTable,
    DateField,
    Identifier,
    useCreatePath,
} from 'react-admin';
import { useNavigate } from 'react-router';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import rowSx from './rowSx';
import BulkAcceptButton from './BulkAcceptButton';
import BulkRejectButton from './BulkRejectButton';
import { type Review } from '../types';

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

const Table = DataTable<Review>;
const Column = DataTable.Col<Review>;

const ReviewListDesktop = ({ selectedRow }: ReviewListDesktopProps) => {
    const navigate = useNavigate();
    const createPath = useCreatePath();
    return (
        <Table
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
            <Column source="date" field={DateField} />
            <Column source="customer_id">
                <CustomerReferenceField source="customer_id" link={false} />
            </Column>
            <Column source="product_id">
                <ProductReferenceField source="product_id" link={false} />
            </Column>
            <Column
                source="rating"
                label="resources.reviews.fields.rating"
                field={StarRatingField}
            />
            <Column
                source="comment"
                sx={{
                    maxWidth: '18em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            />
            <Column source="status" />
        </Table>
    );
};

export default ReviewListDesktop;
