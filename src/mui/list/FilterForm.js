import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui/svg-icons/action/highlight-off';

export class FilterForm extends Component {
    getShownFilters() {
        const { filters, displayedFilters, currentFilters } = this.props;
        return filters
            .filter(filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                currentFilters[filterElement.props.source]
            );
    }

    handleHide = (event) => this.props.hideFilter(event.currentTarget.dataset.key);

    render() {
        const { currentFilters, resource } = this.props;
        return (<div>
            <CardText style={{ float: 'right', marginTop: '-14px', paddingTop: 0 }}>
                {this.getShownFilters().map(filterElement =>
                    <div key={filterElement.props.source}>
                        {filterElement.props.alwaysOn ?
                            <div style={{ width: 48, display: 'inline-block' }}>&nbsp;</div> :
                            <IconButton iconStyle={{ color: '#00bcd4' }} onTouchTap={this.handleHide} data-key={filterElement.props.source} tooltip="Remove this filter">
                                <ActionHide />
                            </IconButton>
                        }
                        <Field
                            {...filterElement.props}
                            name={filterElement.props.source}
                            component={filterElement.type}
                            resource={resource}
                            record={currentFilters}
                        />
                    </div>
                )}
            </CardText>
            <div style={{ clear: 'right' }} />
        </div>);
    }
}

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    currentFilters: PropTypes.object.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
};

FilterForm.defaultProps = {
    currentFilters: {},
};

export default reduxForm({
    form: 'filterForm',
})(FilterForm);
