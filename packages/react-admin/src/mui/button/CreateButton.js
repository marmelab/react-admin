import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Button from 'material-ui/Button';
import ContentAdd from 'material-ui-icons/Add';
import Hidden from 'material-ui/Hidden';
import compose from 'recompose/compose';

import translate from '../../i18n/translate';

const styles = {
    floating: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 60,
        left: 'auto',
        position: 'fixed',
    },
    flat: {
        overflow: 'inherit',
    },
};

const CreateButton = ({
    basePath = '',
    translate,
    label = 'ra.action.create',
}) => [
    <Hidden mdUp key="mobile">
        <Button fab style={styles.floating}>
            <Link to={`${basePath}/create`}>
                <ContentAdd />
            </Link>
        </Button>
    </Hidden>,
    <Hidden mdDown key="destkop">
        <Button color="primary" style={styles.flat}>
            <Link to={`${basePath}/create`}>
                <ContentAdd />
                {label && translate(label)}
            </Link>
        </Button>
    </Hidden>,
];

CreateButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(onlyUpdateForKeys(['basePath', 'label']), translate);

export default enhance(CreateButton);
