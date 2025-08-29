import * as React from 'react';
import { ReactNode } from 'react';
import { UserMenuContext, UserMenuContextValue } from './UserMenuContext';

/**
 * A React context provider that provides access to the user menu context.
 * @param props
 * @param {ReactNode} props.children
 * @param {UserMenuContextValue} props.value The user menu context
 */
export const UserMenuContextProvider = ({ children, value }) => (
    <UserMenuContext.Provider value={value}>
        {children}
    </UserMenuContext.Provider>
);

export type UserMenuContextProviderProps = {
    children: ReactNode;
    value: UserMenuContextValue;
};
