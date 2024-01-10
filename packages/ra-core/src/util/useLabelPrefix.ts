import { useContext } from 'react';
import { LabelPrefixContext } from './LabelPrefixContext';

export const useLabelPrefix = () => useContext(LabelPrefixContext);
