import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Dialog, { DialogTitle } from 'material-ui/Dialog';

import translate from '../../i18n/translate';
import { UPDATE } from '../../dataFetchActions';
import BulkAction from './BulkAction';
import { crudExecuteBulkAction } from '../../actions/dataActions';

const BulkActionDialog = ({
    children,
    translate,
    selection,
    selectionData,
    onExecuteAction,
    ...props
}) => (
    <Dialog {...props}>
        <DialogTitle>
            {translate('ra.page.bulk_update', { count: selection.length })}
        </DialogTitle>
        {children}
    </Dialog>
);

class BulkActionUpdate extends React.Component {
    static defaultProps = {
        label: 'ra.action.edit',
    };
    static propTypes = {
        translate: PropTypes.func,
        label: PropTypes.string,
    };

    state = {
        open: false,
    };

    handleExecuteAction = bulkActionArgs => {
        this.setState({
            open: true,
            bulkActionArgs,
        });
    };
    handleSave = values => {
        this.props.onExecuteAction({
            ...this.state.bulkActionArgs,
            data: values,
        });
        this.handleClose();
    };
    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        const { translate, label, children, ...props } = this.props;
        const { open } = this.state;
        return (
            <div>
                <BulkAction
                    action={UPDATE}
                    cacheAction={UPDATE}
                    notificationSuccess="ra.notification.bulk_action.update.success"
                    notificationFailed="ra.notification.bulk_action.update.failed"
                    keepSelectionFailed
                    {...props}
                    onExecuteAction={this.handleExecuteAction}
                >
                    {translate(label)}
                </BulkAction>
                <BulkActionDialog
                    translate={translate}
                    open={open}
                    onClose={this.handleClose}
                    {...props}
                >
                    {React.cloneElement(children, {
                        save: this.handleSave,
                    })}
                </BulkActionDialog>
            </div>
        );
    }
}

const enhance = compose(
    translate,
    connect(null, { onExecuteAction: crudExecuteBulkAction })
);
export default enhance(BulkActionUpdate);
