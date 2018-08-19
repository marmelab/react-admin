import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { translate } from 'ra-core';

const Title = ({
    className,
    defaultTitle,
    record,
    title,
    translate,
    ...rest
}) => {
    const container = document.getElementById('react-admin-title');
    if (!container) return null;
    if (!defaultTitle && !title && process.env.NODE_ENV !== 'production') {
        console.warn('Missing title prop in <Title> element'); //eslint-disable-line no-console
    }
    const titleElement = !title ? (
        <span className={className} {...rest}>
            {defaultTitle}
        </span>
    ) : typeof title === 'string' ? (
        <span className={className} {...rest}>
            {translate(title, { _: title })}
        </span>
    ) : (
        React.cloneElement(title, { className, record, ...rest })
    );
    return ReactDOM.createPortal(titleElement, container);
};

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default translate(Title);
