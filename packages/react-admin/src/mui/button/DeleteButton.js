import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import ActionDelete from 'material-ui-icons/Delete';
import linkToRecord from '../../util/linkToRecord';
import translate from '../../i18n/translate';

const DeleteButton = ({
    basePath = '',
    label = 'ra.action.delete',
    record = {},
    translate,
}) => (
    <Button
        secondary
        label={label && translate(label)}
        icon={<ActionDelete />}
        containerElement={
            <Link to={`${linkToRecord(basePath, record.id)}/delete`} />
        }
        style={{ overflow: 'inherit' }}
    />
);

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

export default translate(DeleteButton);
