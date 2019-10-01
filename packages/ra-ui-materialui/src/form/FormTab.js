import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { translate } from 'ra-core';
import { Field } from 'redux-form';

import FormInput from './FormInput';

const sanitizeRestProps = ({ label, icon, value, translate, ...rest }) => rest;

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

    renderContent = ({ children, ...rest }) => (
        <Fragment>
            {React.Children.map(
                children,
                input =>
                    input && (
                        <FormInput input={input} {...sanitizeRestProps(rest)} />
                    )
            )}
        </Fragment>
    );

    renderHiddenContent = ({ children }) => (
        <Fragment>
            {React.Children.map(children, raInputComponent => (
                <Field
                    component={() => null}
                    source={raInputComponent.props.source}
                    name={raInputComponent.props.source}
                    validate={raInputComponent.props.validate}
                />
            ))}
        </Fragment>
    );

    render() {
        const { children, context, hidden, ...rest } = this.props;
        return context === 'header'
            ? this.renderHeader(rest)
            : hidden
                ? this.renderHiddenContent({ children })
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
