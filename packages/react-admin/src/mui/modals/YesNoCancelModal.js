import React from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from './ConfirmModal';

const YesNoCancelModal = ({
    allowEscape = true,
    type = 'confirm_yes_no_cancel',
}) => (
    <ConfirmModal
        type={type}
        allowEscape={allowEscape}
        escapeValue={null}
        title="ra.modals.confirm.title"
        message="ra.modals.confirm.message"
        actions={[
            {
                label: 'ra.message.yes',
                value: true,
            },
            {
                label: 'ra.message.no',
                value: false,
            },
            {
                label: 'ra.action.cancel',
                value: null,
            },
        ]}
    />
);
YesNoCancelModal.propTypes = {
    allowEscape: PropTypes.bool,
    type: PropTypes.string,
};

export default YesNoCancelModal;
