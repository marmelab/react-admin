import React from 'react';
import { Datagrid, List, TextField } from 'react-admin';
import Icon from '@material-ui/icons/Bookmark';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';

export const SegmentIcon = Icon;

export const SegmentList = props => (
    <List {...props} sort={{ field: 'name', order: 'ASC' }}>
        <Datagrid>
            <TextField source="name" style={{ padding: '0 12px 0 25px' }} />
            <LinkToRelatedCustomers />
        </Datagrid>
    </List>
);
