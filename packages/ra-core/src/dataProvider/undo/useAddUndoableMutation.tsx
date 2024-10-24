import { useContext } from 'react';
import { AddUndoableMutationContext } from './AddUndoableMutationContext';

export const useAddUndoableMutation = () =>
    useContext(AddUndoableMutationContext);
