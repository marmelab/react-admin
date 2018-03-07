import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui-icons/HighlightOff';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
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
    clearSubmit,
    dirty,
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
    filterValues,
    pure,
    triggerSubmit,
    clearSubmitErrors,
    clearAsyncError,
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

    render() {
        const {
            classes = {},
            className,
            resource,
            translate,
            ...rest
        } = this.props;

        return (
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
                                    <div className={classes.spacer}>&nbsp;</div>
                                ) : (
                                    <IconButton
                                        className="hide-filter"
                                        onClick={this.handleHide}
                                        data-key={filterElement.props.source}
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
        );
    }
}

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    translate: PropTypes.func.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
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

const enhance = compose(
    withStyles(styles),
    translate,
    withProps(mergeInitialValuesWithDefaultValues),
    reduxForm({
        form: 'filterForm',
        enableReinitialize: true,
        destroyOnUnmount: false, // do not destroy to preserve state across navigation
        onChange: (values, dispatch, props) =>
            props && props.setFilters(values),
    })
);

export default enhance(FilterForm);
