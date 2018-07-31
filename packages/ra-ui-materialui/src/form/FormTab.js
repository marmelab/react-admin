import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { translate } from 'ra-core';

import FormInput from './FormInput';

const sanitizeRestProps = ({ label, icon, value, translate, ...rest }) => rest;

const hiddenStyle = { display: 'none' };

class FormTab extends Component {
    renderHeader = ({ className, label, icon, value, translate, ...rest }) => {
        const to = { pathname: value, state: { skipFormReset: true } };

        return (
            <MuiTab
                key={label}
                label={translate(label, { _: label })}
                value={value}
                icon={icon}
                className={classnames('form-tab', className)}
                component={Link}
                to={to}
                {...sanitizeRestProps(rest)}
            />
        );
    };

    renderContent = ({ children, hidden, ...rest }) => (
        <span style={hidden ? hiddenStyle : null}>
            {React.Children.map(
                children,
                input =>
                    input && (
                        <FormInput input={input} {...sanitizeRestProps(rest)} />
                    )
            )}
        </span>
    );

    render() {
        const { children, context, ...rest } = this.props;
        return context === 'header'
            ? this.renderHeader(rest)
            : this.renderContent({ children, ...rest });
    }
}

FormTab.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    context: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    translate: PropTypes.func.isRequired,
    value: PropTypes.string,
};

FormTab.displayName = 'FormTab';

export default translate(FormTab);
