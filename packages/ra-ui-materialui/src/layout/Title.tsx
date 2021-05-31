import * as React from 'react';
import { FC, cloneElement, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, Record, warning } from 'ra-core';
import { TitleText } from './TitleText';

export interface TitleProps {
    className?: string;
    defaultTitle?: string;
    record?: Record;
    title?: string | ReactElement | false;
}

const Title: FC<TitleProps> = ({
    className,
    defaultTitle,
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

    if (typeof title === 'boolean' && !title) return null;

    warning(!defaultTitle && !title, 'Missing title prop in <Title> element');

    const titleElement = !title ? (
        <TitleText className={className} {...rest} text={defaultTitle} />
    ) : typeof title === 'string' ? (
        <TitleText
            className={className}
            {...rest}
            text={translate(title, { _: title })}
        />
    ) : (
        cloneElement(title, { className, record, ...rest })
    );
    return createPortal(titleElement, container);
};

export const TitlePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.bool,
]);

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.any,
    // @ts-ignore
    title: TitlePropType,
};

export default Title;
