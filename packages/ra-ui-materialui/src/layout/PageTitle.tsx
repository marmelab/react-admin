import * as React from 'react';
import { useContext } from 'react';
import { DefaultTitleContext, useTranslate } from 'ra-core';

export const PageTitle = ({ title, defaultTitle, className, ...rest }: any) => {
    const translate = useTranslate();

    // an element title may render its own <title>, which ours would override
    if (title && typeof title !== 'string') {
        return <span className={className}>{title}</span>;
    }

    const pageTitle = title ? translate(title, { _: title }) : defaultTitle;
    return (
        <span className={className}>
            <span {...rest}>{pageTitle}</span>
            <DocumentTitle title={pageTitle} />
        </span>
    );
};

/**
 * Renders a <title> reading "{title} - {app title}"
 *
 * React 19 hoists it to <head>. React 18 leaves it in place, where the
 * index.html <title> takes precedence as it comes first in the document.
 * Renders nothing when <Admin title> isn't set.
 */
export const DocumentTitle = ({ title }: { title: React.ReactNode }) => {
    const appTitle = useContext(DefaultTitleContext);
    if (
        typeof title !== 'string' ||
        typeof appTitle !== 'string' ||
        !title ||
        !appTitle
    ) {
        return null;
    }
    return (
        <title>
            {title === appTitle ? appTitle : `${title} - ${appTitle}`}
        </title>
    );
};
