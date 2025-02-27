import * as React from 'react';
import { TableCellProps } from '@mui/material';

/**
 * This type is used to avoid relying on defaultProps which is deprecated.
 */
export type DatagridField = React.ReactElement & {
    type?: {
        sortable?: boolean;
        textAlign?: TableCellProps['align'];
    };
};
