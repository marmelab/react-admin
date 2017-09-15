import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui/svg-icons/action/highlight-off';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';

import translate from '../../i18n/translate';
import defaultTheme from '../defaultTheme';

const styles = {
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
    icon: { color: '#00bcd4', paddingBottom: 0 },
    clearFix: { clear: 'right' },
};

const emptyRecord = {};

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
        const { resource, translate, theme } = this.props;
        const muiTheme = getMuiTheme(theme);
        const prefix = autoprefixer(muiTheme);
        return (
            <div>
                <CardText style={prefix(styles.card)}>
                    {this.getShownFilters()
                        .reverse()
                        .map(filterElement => (
                            <div
                                key={filterElement.props.source}
                                data-source={filterElement.props.source}
                                className="filter-field"
                                style={
                                    filterElement.props.style ||
                                    prefix(styles.body)
                                }
                            >
                                {filterElement.props.alwaysOn ? (
                                    <div style={prefix(styles.spacer)}>
                                        &nbsp;
                                    </div>
                                ) : (
                                    <IconButton
                                        iconStyle={prefix(styles.icon)}
                                        className="hide-filter"
                                        onClick={this.handleHide}
                                        data-key={filterElement.props.source}
                                        tooltip={translate(
                                            'aor.action.remove_filter'
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
                </CardText>
                <div style={prefix(styles.clearFix)} />
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
    theme: PropTypes.object.isRequired,
};

FilterForm.defaultProps = {
    theme: defaultTheme,
};

const enhance = compose(
    translate,
    withProps(({ initialValues, filters }) => ({
        initialValues: {
            ...filters
                .filter(
                    filterElement =>
                        filterElement.props.alwaysOn &&
                        filterElement.props.defaultValue
                )
                .reduce(
                    (acc, filterElement) => ({
                        ...acc,
                        [filterElement.props.source]:
                            filterElement.props.defaultValue,
                    }),
                    initialValues
                ),
        },
    })),
    reduxForm({
        form: 'filterForm',
        enableReinitialize: true,
        onChange: (values, dispatch, props) => props.setFilters(values),
    })
);

export default enhance(FilterForm);
