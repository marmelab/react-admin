import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

import FormInput from './FormInput';

const sanitizeRestProps = ({
    contentClassName,
    label,
    icon,
    value,
    translate,
    ...rest
}) => rest;

const hiddenStyle = { display: 'none' };

const FormTab = props => {
    const translate = useTranslate();
    const renderHeader = ({ className, label, icon, value, ...rest }) => {
        const to = { pathname: value };

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

    const renderContent = ({
        contentClassName,
        children,
        hidden,
        basePath,
        record,
        resource,
        variant,
        margin,
    }) => (
        <span style={hidden ? hiddenStyle : null} className={contentClassName}>
            {React.Children.map(
                children,
                input =>
                    input && (
                        <FormInput
                            basePath={basePath}
                            input={input}
                            record={record}
                            resource={resource}
                            variant={variant}
                            margin={margin}
                        />
                    )
            )}
        </span>
    );

    const { children, intent, ...rest } = props;
    return intent === 'header'
        ? renderHeader(rest)
        : renderContent({ children, ...rest });
};

FormTab.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    intent: PropTypes.oneOf(['header', 'content']),
    hidden: PropTypes.bool,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    value: PropTypes.string,
};

FormTab.displayName = 'FormTab';

export default FormTab;
