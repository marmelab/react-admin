import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'material-ui/Menu';
import { DELETE, UPDATE } from '../../dataFetchActions';

class BulkAction extends React.Component {
    handleOnClick = (...args) => {
        const {
            resource,
            action,
            actionMeta,
            cacheAction,
            selection,
            selectionData,
            keepSelectionSuccess,
            keepSelectionFailed,
            notificationSuccess,
            notificationFailed,
            notificationFailedArgs,
            refreshList,
            data,
            onClick,
            onExecuteAction,
        } = this.props;

        onExecuteAction({
            resource,
            action,
            ids: selection,
            data: typeof data === 'function' ? data(this.props) : data,
            previousData: selectionData,
            actionMeta: {
                ...actionMeta,
                cacheAction,
                refreshList,
                notification: {
                    success: notificationSuccess,
                    failed: notificationFailed,
                    failedArgs: notificationFailedArgs,
                },
                selection: {
                    keepSuccess: keepSelectionSuccess,
                    keepFailed: keepSelectionFailed,
                },
            },
        });

        if (onClick) onClick(...args);
    };
    render() {
        const {
            resource,
            action,
            actionMeta,
            cacheAction,
            notificationSuccess,
            notificationFailed,
            notificationFailedArgs,
            keepSelectionSuccess,
            keepSelectionFailed,
            selection,
            selectionData,
            refreshList,
            data,
            onExecuteAction,
            ...props
        } = this.props;
        return <MenuItem {...props} onClick={this.handleOnClick} />;
    }
}

BulkAction.propTypes = {
    resource: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    actionMeta: PropTypes.object,
    cacheAction: PropTypes.oneOf([UPDATE, DELETE, 'NONE']).isRequired,
    notificationSuccess: PropTypes.string.isRequired,
    notificationFailed: PropTypes.string.isRequired,
    notificationFailedArgs: PropTypes.func,
    keepSelectionSuccess: PropTypes.bool,
    keepSelectionFailed: PropTypes.bool,
    refreshList: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    selection: PropTypes.array.isRequired,
    selectionData: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onExecuteAction: PropTypes.func.isRequired,
};

export default BulkAction;
