import { useContext } from 'react';
import { TitlePrefixContext } from './TitlePrefixContext';

export const useTitlePrefix = () => useContext(TitlePrefixContext);
