import React, { FC } from 'react';
import { cloneElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Record, useTranslate, warning } from 'ra-core';

const Title = <R extends Record, T>(
    props: TitleProps<R, T>
): React.ReactElement<TitleProps<R, T>> => {
    const { className, defaultTitle, locale, record, title, ...rest } = props;
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

export declare type TitleProp<T> = string | React.ReactElement<T>;

export declare type TitleProps<R extends Record, T> = {
    defaultTitle?: string;
    className?: string;
    locale?: string;
    record?: R;
    title?: TitleProp<T>;
} & T;

export const TitlePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
]);

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    locale: PropTypes.string,
    record: PropTypes.object,
    title: TitlePropType,
};

export default Title;
