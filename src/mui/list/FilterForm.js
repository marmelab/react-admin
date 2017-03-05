import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui/svg-icons/action/highlight-off';
import compose from 'recompose/compose';

import translate from '../../i18n/translate';

const styles = {
    card: { float: 'right', marginTop: '-14px', paddingTop: 0 },
    body: { display: 'inline-block' },
    spacer: { width: 48, display: 'inline-block' },
    icon: { color: '#00bcd4', maddingBottom: 0 },
    field: { display: 'inline-block' },
    clearFix: { clear: 'right' },
};

const emptyRecord = {};

export class FilterForm extends Component {
    getShownFilters() {
        const { filters, displayedFilters, initialValues } = this.props;
        return filters
            .filter(filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                typeof initialValues[filterElement.props.source] !== 'undefined'
            );
    }

    handleHide = (event) => this.props.hideFilter(event.currentTarget.dataset.key);

    render() {
        const { resource, translate } = this.props;
        return (<div>
            <CardText style={styles.card}>
                {this.getShownFilters().reverse().map(filterElement =>
                    <div key={filterElement.props.source} style={filterElement.props.style || styles.body}>
                        {filterElement.props.alwaysOn ?
                            <div style={styles.spacer}>&nbsp;</div> :
                            <IconButton iconStyle={styles.icon} onTouchTap={this.handleHide} data-key={filterElement.props.source} tooltip={translate('aor.action.remove_filter')}>
                                <ActionHide />
                            </IconButton>
                        }
                        <div style={styles.field}>
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
                )}
            </CardText>
            <div style={styles.clearFix} />
        </div>);
    }
}

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    translate,
    reduxForm({ form: 'filterForm' }),
);

export default enhance(FilterForm);
