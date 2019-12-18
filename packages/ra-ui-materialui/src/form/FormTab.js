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

const FormTab = ({
    basePath,
    className,
    contentClassName,
    children,
    hidden,
    icon,
    intent,
    label,
    margin,
    record,
    resource,
    variant,
    value,
    ...rest
}) => {
    const translate = useTranslate();

    const renderHeader = () => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('form-tab', className)}
            component={Link}
            to={{ pathname: value }}
            {...sanitizeRestProps(rest)}
        />
    );

    const renderContent = () => (
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
                            variant={input.props.variant || variant}
                            margin={input.props.margin || margin}
                        />
                    )
            )}
        </span>
    );

    return intent === 'header' ? renderHeader() : renderContent();
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
