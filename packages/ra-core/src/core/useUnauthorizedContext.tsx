import { useContext } from 'react';
import { UnauthorizedContext } from './UnauthorizedContext';

export const useUnauthorizedContext = () => {
    const context = useContext(UnauthorizedContext);
    if (!context) {
        throw new Error(
            'useUnauthorizedContext must be used inside a UnauthorizedContextProvider'
        );
    }
    return context;
};
