import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import ContentBulkAction from 'material-ui-icons/Launch';
import Badge from 'material-ui/Badge';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';

import Responsive from '../layout/Responsive';
import translate from '../../i18n/translate';

const styles = theme => ({
    badge: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
});

const WithBadge = ({ show, children, ...rest }) =>
    show ? (
        <Badge color="secondary" {...rest}>
            {children}
        </Badge>
    ) : (
        React.Children.only(children)
    );
const BulkActionButton = ({
    classes = {},
    translate,
    label = 'ra.action.bulk_action',
    selectedItems,
    ...rest
}) => (
    <Responsive
        small={
            <Button color="primary" className={classes.badge} {...rest}>
                <ContentBulkAction />
            </Button>
        }
        medium={
            <WithBadge show={selectedItems > 1} badgeContent={selectedItems}>
                <Button color="primary" {...rest}>
                    <ContentBulkAction className={classes.iconPaddingStyle} />
                    {label && translate(label)}
                </Button>
            </WithBadge>
        }
    />
);

BulkActionButton.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
    selectedItems: PropTypes.number.isRequired,
};

const enhance = compose(translate, withStyles(styles));

export default enhance(BulkActionButton);
