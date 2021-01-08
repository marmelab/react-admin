import { useContext } from 'react';
import { FormGroupContext } from './FormGroupContext';

export const useFormGroupContext = () => {
    const context = useContext(FormGroupContext);
    return context;
};
