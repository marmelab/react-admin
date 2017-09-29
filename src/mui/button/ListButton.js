import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';
import translate from '../../i18n/translate';

const ListButton = ({
    basePath = '',
    label = 'aor.action.list',
    translate,
}) => (
    <FlatButton
        primary
        label={label && translate(label)}
        icon={<ActionList />}
        containerElement={<Link to={basePath} />}
        style={{ overflow: 'inherit' }}
    />
);

ListButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

export default translate(ListButton);
