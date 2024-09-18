import { useContext } from 'react';
import { LoadingContext } from './LoadingContext';

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error(
            'useLoadingContext must be used inside a LoadingContextProvider'
        );
    }
    return context;
};
