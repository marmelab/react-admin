import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ActionHide from 'material-ui/svg-icons/action/highlight-off';
import * as actions from '../../actions/filterActions';

export class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.timer = null;
        this.state = props.filter.values;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.filter.values !== nextProps.filter.values) {
            this.setState(nextProps.filter.values); // FIXME: erases user entry when fetch response arrives late
        }
    }

    handleChange(key, value) {
        this.setState({ [key]: value });
        // poor man's debounce
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => this.props.setFilter(this.props.resource, key, value), 500);
    }

    handleHide(event) {
        this.props.hideFilter(this.props.resource, event.currentTarget.dataset.key);
    }

    render() {
        const { resource, filters, filter } = this.props;
        return (<div>
            <CardText style={{ float: 'right', marginTop: '-14px', paddingTop: 0 }}>
            {filters.map(filterElement => (filterElement.props.alwaysOn || filter.display[filterElement.props.source]) && (
                <div key={filterElement.props.source}>
                    {filterElement.props.alwaysOn ?
                        <div style={{ width: 88, display: 'inline-block' }}>&nbsp;</div> :
                        <FlatButton
                            primary
                            icon={<ActionHide />}
                            onClick={this.handleHide}
                            data-key={filterElement.props.source}
                        />
                    }
                    <filterElement.type
                        {...filterElement.props}
                        resource={resource}
                        record={this.state}
                        onChange={this.handleChange}
                    />
                </div>
            ))}
            </CardText>
            <div style={{ clear: 'right' }} />
        </div>);
    }
}

FilterForm.propTypes = {
    resource: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    hideFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    filter: state.admin[props.resource].list.params.filter,
});

export default connect(mapStateToProps, actions)(FilterForm);
