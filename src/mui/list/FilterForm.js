import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';
import { CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionHide from 'material-ui/svg-icons/action/highlight-off';

export class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.state = {
            filterValues: props.filterValues,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.filterValues !== nextProps.filterValues) {
            this.setState({ filterValues: nextProps.filterValues }); // FIXME: erases user entry when fetch response arrives late
        }
    }

    getShownFilters() {
        const { filters, displayedFilters, filterValues } = this.props;
        return filters
            .filter(filterElement =>
                filterElement.props.alwaysOn ||
                displayedFilters[filterElement.props.source] ||
                filterValues[filterElement.props.source]
            );
    }

    handleChange(key, value) {
        this.setState({ filterValues: { ...this.state.filterValues, [key]: value } });
        debounce(() => this.props.setFilter(key, value), 500);
    }

    handleHide(event) {
        this.props.hideFilter(event.currentTarget.dataset.key);
    }

    render() {
        const { resource } = this.props;
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
                        <filterElement.type
                            meta={{}}
                            {...filterElement.props}
                            resource={resource}
                            record={this.state.filterValues}
                            onChange={this.handleChange}
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
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    displayedFilters: PropTypes.object.isRequired,
    filterValues: PropTypes.object.isRequired,
    hideFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
};

export default FilterForm;
