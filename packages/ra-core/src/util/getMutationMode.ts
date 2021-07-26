export const getMutationMode = (mutationMode, undoable) => {
    if (mutationMode) {
        return mutationMode;
    }
    switch (undoable) {
        case true:
            return 'undoable';
        case false:
            return 'pessimistic';
        default:
            return 'undoable';
    }
};
