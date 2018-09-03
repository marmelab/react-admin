import React from 'react';
import { Datagrid, List, FunctionField, translate } from 'react-admin';
import Icon from '@material-ui/icons/Bookmark';

import LinkToRelatedCustomers from './LinkToRelatedCustomers';

export const SegmentIcon = Icon;

export const SegmentList = translate(({ translate, ...props }) => (
    <List {...props} sort={{ field: 'name', order: 'ASC' }}>
        <Datagrid>
            <FunctionField
                label="resources.Segment.fields.name"
                style={{ padding: '0 12px 0 25px' }}
                render={record =>
                    translate(`resources.Segment.data.${record.name}`)
                }
            />
            <LinkToRelatedCustomers />
        </Datagrid>
    </List>
));
