import * as React from 'react';
import { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { RaRecord, warning } from 'ra-core';

import { PageTitleConfigurable } from './PageTitleConfigurable';

export const Title = (props: TitleProps) => {
    const { defaultTitle, title, preferenceKey, ...rest } = props;
    const [container, setContainer] = useState(() =>
        typeof document !== 'undefined'
            ? document.getElementById('react-admin-title')
            : null
    );

    // on first mount, we don't have the container yet, so we wait for it
    useEffect(() => {
        setContainer(container => {
            const isInTheDom =
                typeof document !== 'undefined' &&
                document.body.contains(container);
            if (container && isInTheDom) return container;
            return typeof document !== 'undefined'
                ? document.getElementById('react-admin-title')
                : null;
        });
    }, []);

    if (!container) return null;

    warning(!defaultTitle && !title, 'Missing title prop in <Title> element');

    return createPortal(
        <PageTitleConfigurable
            title={title}
            defaultTitle={defaultTitle}
            preferenceKey={preferenceKey}
            {...rest}
        />,
        container
    );
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
    preferenceKey?: string;
}
