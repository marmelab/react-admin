import { createContext } from 'react';

import type { UndoableMutation } from './types';

export const AddUndoableMutationContext = createContext<
    (mutation: UndoableMutation) => void
>(() => {});
