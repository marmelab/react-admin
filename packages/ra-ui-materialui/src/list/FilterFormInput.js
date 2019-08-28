import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import IconButton from '@material-ui/core/IconButton';
import ActionHide from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

const emptyRecord = {};

const sanitizeRestProps = ({ alwaysOn, ...props }) => props;

const useStyles = makeStyles(theme => ({
    body: { display: 'flex', alignItems: 'flex-end' },
    spacer: { width: theme.spacing(2) },
    hideButton: {},
}));

const FilterFormInput = ({
    filterElement,
    handleHide,
    classes: classesOverride,
    resource,
    variant,
    margin,
}) => {
    const translate = useTranslate();
    const classes = useStyles({ classes: classesOverride });
    return (
        <div
            data-source={filterElement.props.source}
            className={classnames('filter-field', classes.body)}
        >
            {!filterElement.props.alwaysOn && (
                <IconButton
                    className={classnames('hide-filter', classes.hideButton)}
                    onClick={handleHide}
                    data-key={filterElement.props.source}
                    title={translate('ra.action.remove_filter')}
                >
                    <ActionHide />
                </IconButton>
            )}
            <Field
                allowEmpty
                {...sanitizeRestProps(filterElement.props)}
                name={filterElement.props.source}
                component={filterElement.type}
                resource={resource}
                record={emptyRecord}
                variant={variant}
                margin={margin}
            />
            <div className={classes.spacer}>&nbsp;</div>
        </div>
    );
};

FilterFormInput.propTypes = {
    filterElement: PropTypes.node,
    handleHide: PropTypes.func,
    classes: PropTypes.object,
    resource: PropTypes.string,
};

export default FilterFormInput;
