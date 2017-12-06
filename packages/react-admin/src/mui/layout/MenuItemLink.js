import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MenuItem } from 'material-ui/Menu';

const iconPaddingStyle = { paddingRight: '0.5em' };

export class MenuItemLink extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        onClick: PropTypes.func,
        to: PropTypes.string.isRequired,
    };

    handleMenuTap = () => {
        this.props.onClick && this.props.onClick();
    };

    render() {
        const { primaryText, leftIcon, staticContext, ...props } = this.props;

        return (
            <MenuItem component={Link} {...props} onClick={this.handleMenuTap}>
                {leftIcon && <span style={iconPaddingStyle}>{leftIcon}</span>}
                {primaryText}
            </MenuItem>
        );
    }
}

export default MenuItemLink;
