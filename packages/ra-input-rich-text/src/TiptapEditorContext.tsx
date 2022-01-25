import { createContext } from 'react';
import { Editor } from '@tiptap/react';

export const TiptapEditorContext = createContext<Editor>(undefined);
