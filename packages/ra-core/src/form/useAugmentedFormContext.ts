import { useContext } from 'react';
import { AugmentedFormContext } from './AugmentedFormContext';

/**
 * Retrieve the methods to handle form submission.
 */
export const useAugmentedFormContext = () => {
    const context = useContext(AugmentedFormContext);
    return context;
};
