import { useContext } from 'react';

import { BasenameContext } from './BasenameContext';

export const useBasename = () => useContext(BasenameContext);
