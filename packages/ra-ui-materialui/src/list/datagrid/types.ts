import * as React from 'react';
import { TableCellProps } from '@mui/material';

export type DatagridField = React.ReactElement & {
    type?: {
        sortable?: boolean;
        textAlign?: TableCellProps['align'];
    };
};
