import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import ActionList from 'material-ui-icons/List';
import translate from '../../i18n/translate';

const ListButton = ({ basePath = '', label = 'ra.action.list', translate }) => (
    <Button
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
