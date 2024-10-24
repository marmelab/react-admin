import { useContext } from 'react';
import { TakeUndoableMutationContext } from './TakeUndoableMutationContext';

export const useTakeUndoableMutation = () =>
    useContext(TakeUndoableMutationContext);
