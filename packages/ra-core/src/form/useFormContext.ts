import { useContext } from 'react';
import FormContext from './FormContext';

export const useFormContext = () => {
    const context = useContext(FormContext);

    return context;
};
