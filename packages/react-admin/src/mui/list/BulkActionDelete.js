import React from 'react';
import { DELETE } from '../../dataFetchActions';
import BulkActionCustom from './BulkActionCustom';

const BulkActionDelete = props => (
    <BulkActionCustom
        label="ra.action.delete"
        action={DELETE}
        cacheAction={DELETE}
        notificationSuccess="ra.notification.bulk_action.delete.success"
        notificationFailed="ra.notification.bulk_action.delete.failed"
        refreshList
        keepSelectionFailed
        {...props}
    />
);
export default BulkActionDelete;
