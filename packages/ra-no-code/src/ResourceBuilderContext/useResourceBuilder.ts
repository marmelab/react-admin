import { useContext } from 'react';
import { ResourceBuilderContext } from './ResourceBuilderContext';

export const useResourceBuilder = () => useContext(ResourceBuilderContext);
