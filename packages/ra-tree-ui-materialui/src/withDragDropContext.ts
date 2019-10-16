import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Workaround for error "Cannot have two HTML5 backends at the same time"
// See https://github.com/react-dnd/react-dnd/issues/186#issuecomment-282789420
// By initializing the context in a separate module, we prevent it to change and recreate its backend on every render
export default DragDropContext(HTML5Backend);
