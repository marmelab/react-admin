import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import * as actions from '../../actions/filterActions';

export class FilterButton extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.state = {
            open: false,
        };
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleTouchTap(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleShow(event) {
        this.props.showFilter(this.props.resource, event.currentTarget.dataset.key);
        this.setState({
            open: false,
        });
    }

    getMenuItems() {
        const { filters, filter } = this.props;
        return filters
            .filter(filterElement => !filterElement.props.alwaysOn)
            .filter(filterElement => !filter.display[filterElement.props.source])
            .map(filterElement =>
                <MenuItem data-key={filterElement.props.source} key={filterElement.props.source} primaryText={filterElement.props.label} onTouchTap={this.handleShow} />
            );
    }

    render() {
        const items = this.getMenuItems();
        return (items.length ? <span>
            <FlatButton label="Add Filter" icon={<ContentFilter />} onTouchTap={this.handleTouchTap} />
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleRequestClose}
            >
                <Menu>
                    {items}
                </Menu>
            </Popover>
        </span> : null);
    }
}

FilterButton.propTypes = {
    resource: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    filters: PropTypes.arrayOf(PropTypes.node).isRequired,
    showFilter: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    filter: state.admin[props.resource].list.params.filter,
});

export default connect(mapStateToProps, actions)(FilterButton);
