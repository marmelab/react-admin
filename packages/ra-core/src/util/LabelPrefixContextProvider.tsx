import * as React from 'react';
import { LabelPrefixContext } from './LabelPrefixContext';
import { useLabelPrefix } from './useLabelPrefix';

export const LabelPrefixContextProvider = ({
    prefix,
    concatenate = true,
    children,
}) => {
    const oldPrefix = useLabelPrefix();
    const newPrefix =
        oldPrefix && concatenate ? `${oldPrefix}.${prefix}` : prefix;
    return (
        <LabelPrefixContext.Provider value={newPrefix}>
            {children}
        </LabelPrefixContext.Provider>
    );
};
