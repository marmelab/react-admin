import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ActionList from 'material-ui-icons/List';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

import Link from '../Link';
import translate from '../../i18n/translate';
import Responsive from '../layout/Responsive';

const styles = {
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    label: {
        marginLeft: '0.5em',
    },
};

const ListButton = ({
    basePath = '',
    className,
    classes = {},
    label = 'ra.action.list',
    translate,
    ...rest
}) => (
    <Button
        className={classnames(classes.link, className)}
        component={Link}
        color="primary"
        to={basePath}
        {...rest}
    >
        <ActionList />
        <Responsive
            small={<span />}
            medium={
                <span className={classes.label}>
                    {label && translate(label)}
                </span>
            }
        />
    </Button>
);

ListButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(ListButton);
