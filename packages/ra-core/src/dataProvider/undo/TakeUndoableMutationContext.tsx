import { createContext } from 'react';

import type { UndoableMutation } from './types';

export const TakeUndoableMutationContext = createContext<
    () => UndoableMutation | void
>(() => {});
