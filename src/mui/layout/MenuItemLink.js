import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from 'material-ui/MenuItem';
import { withRouter } from 'react-router';

export class MenuItemLinkComponent extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        to: PropTypes.string.isRequired,
        style: PropTypes.object,
    };

    handleMenuTap = () => {
        this.props.history.push(this.props.to);
        this.props.onClick();
    };
    render() {
    const { history, match, location, staticContext, ...props } = this.props; // eslint-disable-line
        const customStyle = {
            color: 'white',
        };
        return (
            <MenuItem
                {...props}
                style={customStyle}
                onClick={this.handleMenuTap}
            />
        );
    }
}

export default withRouter(MenuItemLinkComponent);
