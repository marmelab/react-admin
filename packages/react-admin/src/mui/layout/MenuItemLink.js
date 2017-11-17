import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MenuItem } from 'material-ui/Menu';
import { withRouter } from 'react-router';

const iconPaddingStyle = { paddingRight: '0.5em' };

export class MenuItemLink extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        onClick: PropTypes.func,
        to: PropTypes.string.isRequired,
    };

    handleMenuTap = () => {
        this.props.history.push(this.props.to);
        this.props.onClick && this.props.onClick();
    };

    render() {
        const {
            primaryText,
            leftIcon,
            history,
            match,
            location,
            staticContext,
            ...props
        } = this.props;

        return (
            <MenuItem {...props} onClick={this.handleMenuTap}>
                {leftIcon && <span style={iconPaddingStyle}>{leftIcon}</span>}
                {primaryText}
            </MenuItem>
        );
    }
}

export default withRouter(MenuItemLink);
