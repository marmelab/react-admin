import * as React from 'react';
import { Identifier, Datagrid, DateField, TextField } from 'react-admin';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import rowStyle from './rowStyle';

export interface ReviewListDesktopProps {
    selectedRow?: Identifier;
}

const ReviewListDesktop = ({ selectedRow }: ReviewListDesktopProps) => (
    <Datagrid
        rowClick="edit"
        rowStyle={rowStyle(selectedRow)}
        optimized
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
        <CustomerReferenceField link={false} />
        <ProductReferenceField link={false} />
        <StarRatingField size="small" />
        <TextField source="comment" />
        <TextField source="status" />
    </Datagrid>
);

export default ReviewListDesktop;
