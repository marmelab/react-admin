import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
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

export const CreateButton = ({
    basePath = '',
    translate,
    label = 'aor.action.create',
    width,
    disabled,
}) =>
    width === 1 ? (
        <FloatingActionButton
            style={styles.floating}
            containerElement={
                disabled ? 'div' : <Link to={`${basePath}/create`} />
            }
            disabled={disabled}
        >
            <ContentAdd />
        </FloatingActionButton>
    ) : (
        <FlatButton
            primary
            label={label && translate(label)}
            icon={<ContentAdd />}
            containerElement={
                disabled ? 'div' : <Link to={`${basePath}/create`} />
            }
            style={styles.flat}
            disabled={disabled}
        />
    );

CreateButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
    width: PropTypes.number,
    disabled: PropTypes.bool,
};

const enhance = compose(
    onlyUpdateForKeys(['basePath', 'label']),
    withWidth(),
    translate
);

export default enhance(CreateButton);
