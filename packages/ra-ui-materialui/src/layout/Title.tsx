import React, { cloneElement, FC, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, warning, Record } from 'ra-core';

export type TitleType = string | ReactElement;

export interface TitleProps {
    className?: string;
    defaultTitle?: string;
    locale?: string;
    record?: Record;
    title?: TitleType;
    [key: string]: any;
}

const Title: FC<TitleProps> = ({
    className,
    defaultTitle,
    locale,
    record,
    title,
    ...rest
}) => {
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

export const TitlePropType = PropTypes.element;

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    locale: PropTypes.string,
    record: PropTypes.any,
    title: TitlePropType,
};

export default Title;
