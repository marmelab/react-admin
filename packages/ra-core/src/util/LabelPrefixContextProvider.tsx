import * as React from 'react';
import { LabelPrefixContext } from './LabelPrefixContext';

export const LabelPrefixContextProvider = ({ prefix, children }) => {
    return (
        <LabelPrefixContext.Provider value={prefix}>
            {children}
        </LabelPrefixContext.Provider>
    );
};
