import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Button from 'material-ui/Button';
import ContentAdd from 'material-ui-icons/Add';
import withWidth from 'material-ui/utils/withWidth';
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
    width,
}) =>
    width === 1 ? (
        <Button
            fab
            style={styles.floating}
            containerElement={<Link to={`${basePath}/create`} />}
        >
            <ContentAdd />
        </Button>
    ) : (
        <Button
            primary
            label={label && translate(label)}
            icon={<ContentAdd />}
            containerElement={<Link to={`${basePath}/create`} />}
            style={styles.flat}
        />
    );

CreateButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
    width: PropTypes.number,
};

const enhance = compose(
    onlyUpdateForKeys(['basePath', 'label']),
    withWidth(),
    translate
);

export default enhance(CreateButton);
