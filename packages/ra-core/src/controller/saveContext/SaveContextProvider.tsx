import * as React from 'react';
import { SaveContext } from './SaveContext';

export const SaveContextProvider = ({ children, value }) => (
    <SaveContext.Provider value={value}>{children}</SaveContext.Provider>
);
