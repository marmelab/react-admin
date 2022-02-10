import * as React from 'react';
import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, RaRecord, warning } from 'ra-core';

export const Title = (props: TitleProps) => {
    const { className, defaultTitle, title, ...rest } = props;
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
        title
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
    record?: Partial<RaRecord>;
    title?: string | ReactElement;
}
