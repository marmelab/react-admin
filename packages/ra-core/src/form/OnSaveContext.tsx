import React, { createContext } from 'react';
import { SetOnSave } from '../types';

const defaultSetOnSave: SetOnSave = onSave => {};

const OnSaveContext = createContext<SetOnSave>(defaultSetOnSave);

OnSaveContext.displayName = 'OnSaveContext';

export default OnSaveContext;
