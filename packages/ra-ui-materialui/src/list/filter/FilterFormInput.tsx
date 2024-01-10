import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import ActionHide from '@mui/icons-material/RemoveCircleOutline';
import clsx from 'clsx';
import { useResourceContext, useTranslate } from 'ra-core';

export const FilterFormInput = props => {
    const { filterElement, handleHide, className } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    return (
        <Root
            data-source={filterElement.props.source}
            className={clsx('filter-field', className)}
        >
            {React.cloneElement(filterElement, {
                resource,
                record: emptyRecord,
                size: filterElement.props.size ?? 'small',
                helperText: false,
                // ignore defaultValue in Field because it was already set in Form (via mergedInitialValuesWithDefaultValues)
                defaultValue: undefined,
            })}
            {!filterElement.props.alwaysOn && (
                <IconButton
                    className={clsx(
                        'hide-filter',
                        FilterFormInputClasses.hideButton
                    )}
                    onClick={handleHide}
                    data-key={filterElement.props.source}
                    title={translate('ra.action.remove_filter')}
                    size="small"
                >
                    <ActionHide />
                </IconButton>
            )}

            <div className={FilterFormInputClasses.spacer}>&nbsp;</div>
        </Root>
    );
};

FilterFormInput.propTypes = {
    filterElement: PropTypes.node,
    handleHide: PropTypes.func,
    resource: PropTypes.string,
    className: PropTypes.string,
};

const PREFIX = 'RaFilterFormInput';

export const FilterFormInputClasses = {
    spacer: `${PREFIX}-spacer`,
    hideButton: `${PREFIX}-hideButton`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-end',
    pointerEvents: 'auto',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },

    [`& .${FilterFormInputClasses.spacer}`]: { width: theme.spacing(2) },
    [`& .${FilterFormInputClasses.hideButton}`]: {
        marginBottom: theme.spacing(1),
    },
}));

const emptyRecord = {};
