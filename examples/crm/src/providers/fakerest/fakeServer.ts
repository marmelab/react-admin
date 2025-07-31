import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import { type CollectionItem, getMswHandler, withDelay } from 'fakerest';
import generateData from './dataGenerator';

const handler = getMswHandler({
    baseUrl: 'http://localhost:4000',
    data: generateData() as CollectionItem,
    middlewares: [withDelay(300)],
});
export const worker = setupWorker(http.all(/http:\/\/localhost:4000/, handler));

export default () => worker;
