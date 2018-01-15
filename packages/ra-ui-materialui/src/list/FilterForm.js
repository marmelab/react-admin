import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, submit } from 'redux-form';
import { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui-icons/HighlightOff';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import debounce from 'lodash.debounce';

import lodashSet from 'lodash.set';
import { translate } from 'ra-core';

const styles = ({ palette: { primary1Color } }) => ({
    card: {
        marginTop: '-14px',
        paddingTop: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    body: { display: 'flex', alignItems: 'flex-end' },
    spacer: { width: 48 },
    icon: { color: primary1Color || '#00bcd4', paddingBottom: 0 },
    clearFix: { clear: 'right' },
});

const emptyRecord = {};

const sanitizeRestProps = ({
    anyTouched,
    asyncValidate,
    asyncValidating,
    cancelOnChangeDebounce,
    clearSubmit,
    dirty,
    debounce,
    handleSubmit,
    initialized,
    initialValues,
    invalid,
    pristine,
    submitting,
    submitFailed,
    submitSucceeded,
    valid,
    hideFilter,
    displayedFilters,
    setFilter,
    setFilters,
    array,
    form,
    locale,
    filters,
    filterValues,
    pure,
    clearSubmitErrors,
    clearAsyncError,
    triggerSubmit,
    blur,
    change,
    destroy,
    dispatch,
    initialize,
    reset,
    touch,
    untouch,
    validate,
    save,
    translate,
    autofill,
    submit,
    ...props
}) => props;

export class FilterForm extends Component {
    getShownFilters() {
        const { filters, displayedFilters, initialValues } = this.props;
        return filters.filter(
            filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof initialValues[filterElement.props.source] !== 'undefined'
        );
    }

    handleHide = event =>
        this.props.hideFilter(event.currentTarget.dataset.key);

    componentWillUnmount() {
        this.props.cancelOnChangeDebounce();
    }

    render() {
        const {
            classes = {},
            className,
            resource,
            translate,
            handleSubmit,
            ...rest
        } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div className={className} {...sanitizeRestProps(rest)}>
                    <CardContent className={classes.card}>
                        {this.getShownFilters()
                            .reverse()
                            .map(filterElement => (
                                <div
                                    key={filterElement.props.source}
                                    data-source={filterElement.props.source}
                                    className={classnames(
                                        'filter-field',
                                        classes.body
                                    )}
                                >
                                    {filterElement.props.alwaysOn ? (
                                        <div className={classes.spacer}>
                                            &nbsp;
                                        </div>
                                    ) : (
                                        <IconButton
                                            className="hide-filter"
                                            onClick={this.handleHide}
                                            data-key={
                                                filterElement.props.source
                                            }
                                            tooltip={translate(
                                                'ra.action.remove_filter'
                                            )}
                                        >
                                            <ActionHide />
                                        </IconButton>
                                    )}
                                    <div>
                                        <Field
                                            allowEmpty
                                            {...filterElement.props}
                                            name={filterElement.props.source}
                                            component={filterElement.type}
                                            resource={resource}
                                            record={emptyRecord}
                                        />
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                    <div className={classes.clearFix} />
                </div>
            </form>
        );
    }
}

FilterForm.propTypes = {
    setFilters: PropTypes.func,
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    translate: PropTypes.func.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    cancelOnChangeDebounce: PropTypes.func,
};

export const mergeInitialValuesWithDefaultValues = ({
    initialValues,
    filters,
}) => ({
    initialValues: {
        ...filters
            .filter(
                filterElement =>
                    filterElement.props.alwaysOn &&
                    filterElement.props.defaultValue
            )
            .reduce(
                (acc, filterElement) =>
                    lodashSet(
                        { ...acc },
                        filterElement.props.source,
                        filterElement.props.defaultValue
                    ),
                {}
            ),
        ...initialValues,
    },
});

/*
 *
 * 1. Limits the request rate of requests to the server
 * 2. Allows the change to be properly propogated to the redux state
 */
const filterFormProps = ({ resource, debounce: debounceDelay }) => {
    const onChange = debounce(
        (values, dispatch, props) =>
            props && props.form && dispatch && dispatch(submit(props.form)),
        debounceDelay
    );
    return {
        // We can't use the same form key for all resources, because the filter is cloned before rendering
        // when the actual render will happen, the previous filter form will unmount and destroy the redux state for it's form
        // So for a short period of time there are at most two FilterForm state's in the reduxform state.
        form: `${resource}FilterForm`,
        onChange,
        cancelOnChangeDebounce: () => onChange.cancel(),
    };
};

const combineWithProps = props => ({
    ...mergeInitialValuesWithDefaultValues(props),
    ...filterFormProps(props),
});

const enhance = compose(
    withStyles(styles),
    translate,
    withProps(combineWithProps),
    reduxForm({
        enableReinitialize: true,
        onSubmit: (values, dispatch, props) =>
            props.valid && props.setFilters(values),
    })
);

export default enhance(FilterForm);
