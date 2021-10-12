import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Identifier,
    Datagrid,
    DateField,
    TextField,
    DatagridProps,
} from 'react-admin';

import ProductReferenceField from '../products/ProductReferenceField';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import rowStyle from './rowStyle';

const PREFIX = 'ReviewListDesktop';

const classes = {
    headerRow: `${PREFIX}-headerRow`,
    headerCell: `${PREFIX}-headerCell`,
    rowCell: `${PREFIX}-rowCell`,
    comment: `${PREFIX}-comment`,
};

const StyledDatagrid = styled(Datagrid)({
    [`& .${classes.headerRow}`]: {
        borderLeftColor: 'transparent',
        borderLeftWidth: 5,
        borderLeftStyle: 'solid',
    },
    [`& .${classes.headerCell}`]: {
        padding: '6px 8px 6px 8px',
    },
    [`& .${classes.rowCell}`]: {
        padding: '6px 8px 6px 8px',
    },
    [`& .${classes.comment}`]: {
        maxWidth: '18em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
});

export interface ReviewListDesktopProps extends DatagridProps {
    selectedRow?: Identifier;
}

const ReviewListDesktop = ({
    selectedRow,
    ...props
}: ReviewListDesktopProps) => {
    return (
        <StyledDatagrid
            rowClick="edit"
            // @ts-ignore
            rowStyle={rowStyle(selectedRow)}
            classes={{
                headerRow: classes.headerRow,
                headerCell: classes.headerCell,
                rowCell: classes.rowCell,
            }}
            optimized
            {...props}
        >
            <DateField source="date" />
            <CustomerReferenceField link={false} />
            <ProductReferenceField link={false} />
            <StarRatingField size="small" />
            <TextField source="comment" cellClassName={classes.comment} />
            <TextField source="status" />
        </StyledDatagrid>
    );
};

export default ReviewListDesktop;
