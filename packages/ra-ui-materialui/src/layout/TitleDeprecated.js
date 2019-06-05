import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'ra-core';

/**
 * @deprecated Use Title instead
 */
const Title = ({ className, defaultTitle, record, title, translate, locale, ...rest }) => {
    if (!title) {
        return (
            <span className={className} {...rest}>
                {defaultTitle}
            </span>
        );
    }
    if (typeof title === 'string') {
        return (
            <span className={className} {...rest}>
                {translate(title, { _: title })}
            </span>
        );
    }
    return React.cloneElement(title, { className, record, ...rest });
};

Title.propTypes = {
    defaultTitle: PropTypes.string.isRequired,
    className: PropTypes.string,
    locale: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default translate(Title);
