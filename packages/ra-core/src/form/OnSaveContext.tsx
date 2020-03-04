import React, { createContext } from 'react';
import { SetOnSave } from '../types';

const defaultSetOnSave: SetOnSave = () => {};

const OnSaveContext = createContext<SetOnSave>(defaultSetOnSave);

OnSaveContext.displayName = 'OnSaveContext';

export default OnSaveContext;
