import data from './data';
import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import { getMswHandler, withDelay } from 'fakerest';

const handler = getMswHandler({
    baseUrl: 'http://localhost:4000',
    data,
    middlewares: [withDelay(300)],
});
export const worker = setupWorker(http.all(/http:\/\/localhost:4000/, handler));

export default () => worker;
