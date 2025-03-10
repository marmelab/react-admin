import * as React from 'react';
import DatagridBody, { type DatagridBodyProps } from './DatagridBody';
import DatagridRowModern from './DatagridRowModern';

export const DatagridBodyModern = (props: DatagridBodyProps) => (
    <DatagridBody row={<DatagridRowModern />} {...props} />
);
