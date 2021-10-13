import * as React from 'react';
import { cloneElement, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, Record, warning } from 'ra-core';

export const Title = ({
    className,
    defaultTitle,
    record,
    title,
    ...rest
}: TitleProps) => {
    const translate = useTranslate();
    const container =
        typeof document !== 'undefined'
            ? document.getElementById('react-admin-title')
            : null;

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
        cloneElement(title, { className, record, ...rest })
    );
    return createPortal(titleElement, container);
};

export const TitlePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
]);

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.any,
    title: TitlePropType,
};

export interface TitleProps {
    className?: string;
    defaultTitle?: string;
    record?: Record;
    title?: string | ReactElement;
}
