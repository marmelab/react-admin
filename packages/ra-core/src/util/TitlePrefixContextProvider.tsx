import * as React from 'react';
import { TitlePrefixContext } from './TitlePrefixContext';
import { useTitlePrefix } from './useTitlePrefix';

export const TitlePrefixContextProvider = ({
    prefix,
    concatenate = true,
    children,
}) => {
    const oldPrefix = useTitlePrefix();
    const newPrefix =
        oldPrefix && concatenate ? `${oldPrefix}.${prefix}` : prefix;
    return (
        <TitlePrefixContext.Provider value={newPrefix}>
            {children}
        </TitlePrefixContext.Provider>
    );
};
