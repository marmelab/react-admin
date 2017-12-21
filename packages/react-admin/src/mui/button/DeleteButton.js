import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ActionDelete from 'material-ui-icons/Delete';
import { withStyles } from 'material-ui/styles';

import Link from '../Link';
import linkToRecord from '../../util/linkToRecord';
import translate from '../../i18n/translate';
import classnames from 'classnames';
import Responsive from '../layout/Responsive';

const styles = {
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    label: {
        paddingLeft: '0.5em',
    },
};

const DeleteButton = ({
    basePath = '',
    className,
    classes = {},
    label = 'ra.action.delete',
    record = {},
    translate,
    ...rest
}) => (
    <Button
        className={classnames(classes.link, className)}
        component={Link}
        color="accent"
        to={`${linkToRecord(basePath, record.id)}/delete`}
        {...rest}
    >
        <ActionDelete />
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

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(DeleteButton);
