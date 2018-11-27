import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavigationRefresh from '@material-ui/icons/Refresh';
import { refreshView as refreshViewAction } from 'ra-core';

import Button from './Button';

class RefreshButton extends Component {
    static propTypes = {
        label: PropTypes.string,
        refreshView: PropTypes.func.isRequired,
        icon: PropTypes.element,
    };

    static defaultProps = {
        label: 'ra.action.refresh',
        icon: <NavigationRefresh />,
    };

    handleClick = event => {
        event.preventDefault();
        this.props.refreshView();
    };

    render() {
        const { label, refreshView, icon, ...rest } = this.props;

        return (
            <Button label={label} onClick={this.handleClick} {...rest}>
                {icon}
            </Button>
        );
    }
}

const enhance = connect(
    null,
    { refreshView: refreshViewAction }
);

export default enhance(RefreshButton);
