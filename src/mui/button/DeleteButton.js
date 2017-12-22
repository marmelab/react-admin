import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import linkToRecord from '../../util/linkToRecord';
import translate from '../../i18n/translate';

export const DeleteButton = ({
    basePath = '',
    label = 'aor.action.delete',
    record = {},
    translate,
    disabled,
}) => (
    <FlatButton
        secondary
        label={label && translate(label)}
        icon={<ActionDelete />}
        containerElement={
            disabled ? (
                'div'
            ) : (
                <Link to={`${linkToRecord(basePath, record.id)}/delete`} />
            )
        }
        style={{ overflow: 'inherit' }}
        disabled={disabled}
    />
);

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default translate(DeleteButton);
