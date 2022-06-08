
## Null value on Text INput

### go to useEditController.ts

look at the current path .

check that the input data is not empty

#### example for EditPost

const postEditArgument;

if (!postEditArgument && context.snapshot[0][0][0] == 'posts') {
notify('ra.notification.inputError', {
type: 'warning',
messageArgs: { smart_count: 1 },
undoable: mutationMode === 'undoable',
});
}


