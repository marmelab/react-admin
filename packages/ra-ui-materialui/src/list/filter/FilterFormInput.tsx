import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ActionHide from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useResourceContext, useTranslate } from 'ra-core';

const emptyRecord = {};

const useStyles = makeStyles(
    theme => ({
        body: {
            display: 'flex',
            alignItems: 'flex-end',
            pointerEvents: 'auto',
        },
        spacer: { width: theme.spacing(2) },
        hideButton: {},
    }),
    { name: 'RaFilterFormInput' }
);

const FilterFormInput = props => {
    const { filterElement, handleHide, variant, margin } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const classes = useStyles(props);
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
            {React.cloneElement(filterElement, {
                allowEmpty:
                    filterElement.props.allowEmpty === undefined
                        ? true
                        : filterElement.props.allowEmpty,
                resource,
                record: emptyRecord,
                variant,
                margin,
                helperText: false,
                // ignore defaultValue in Field because it was already set in Form (via mergedInitialValuesWithDefaultValues)
                defaultValue: undefined,
            })}
            <div className={classes.spacer}>&nbsp;</div>
        </div>
    );
};

FilterFormInput.propTypes = {
    filterElement: PropTypes.node,
    handleHide: PropTypes.func,
    classes: PropTypes.object,
    resource: PropTypes.string,
    margin: PropTypes.string,
    variant: PropTypes.string,
};

export default FilterFormInput;
