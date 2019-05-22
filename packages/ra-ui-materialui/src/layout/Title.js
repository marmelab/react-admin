import React, { createElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, warning, ComponentPropType } from 'ra-core';

const Title = ({ className, defaultTitle, locale, record, title, ...rest }) => {
    const translate = useTranslate();
    const container = document.getElementById('react-admin-title');
    if (!container) return null;
    warning(!defaultTitle && !title, 'Missing title prop in <Title> element');

    const titleElement = !title ? (
        <span className={className} {...rest}>
            {defaultTitle}
        </span>
    ) : typeof title === 'string' ? (
        <span className={className} {...rest}>
            {translate(title, { _: title })}
        </span>
    ) : (
        createElement(title, { className, record, ...rest })
    );
    return createPortal(titleElement, container);
};

export const TitlePropType = PropTypes.oneOfType([PropTypes.string, ComponentPropType]);

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    locale: PropTypes.string,
    record: PropTypes.object,
    title: TitlePropType,
};

export default Title;
