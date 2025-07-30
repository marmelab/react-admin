import { createRoot } from 'react-dom/client';

import App from './App';
import fakeServerWorker from './fakeServer';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container found');
}
const root = createRoot(container);

fakeServerWorker(process.env.REACT_APP_DATA_PROVIDER ?? '')
    .then(worker => worker.start({ onUnhandledRequest: 'bypass', quiet: true }))
    .then(() => {
        root.render(<App />);
    });
