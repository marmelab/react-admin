import { useContext } from 'react';
import { ResourceConfigurationContext } from './ResourceConfigurationContext';

export const useResourceConfigurations = () => {
    const context = useContext(ResourceConfigurationContext);
    return context;
};
