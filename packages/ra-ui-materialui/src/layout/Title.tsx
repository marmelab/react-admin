import * as React from 'react';
import { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { RaRecord, TitleComponent, warning } from 'ra-core';

import { PageTitle } from './PageTitle';
import { PageTitleConfigurable } from './PageTitleConfigurable';

export const Title = (props: TitleProps) => {
    const { defaultTitle, title, preferenceKey, ...rest } = props;
    const [container, setContainer] = useState<HTMLElement | null>(() =>
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

    const pageTitle =
        preferenceKey === false ? (
            <PageTitle title={title} defaultTitle={defaultTitle} {...rest} />
        ) : (
            <PageTitleConfigurable
                title={title}
                defaultTitle={defaultTitle}
                preferenceKey={preferenceKey}
                {...rest}
            />
        );

    return <>{createPortal(pageTitle, container)}</>;
};

export interface TitleProps {
    className?: string;
    defaultTitle?: TitleComponent;
    record?: Partial<RaRecord>;
    title?: string | ReactElement;
    preferenceKey?: string | false;
}
