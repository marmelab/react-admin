import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import { type CollectionItem, getMswHandler, withDelay } from 'fakerest';
import generateData from './dataGenerator';

const handler = getMswHandler({
    baseUrl: 'https://crm.api.marmelab.com',
    data: generateData() as CollectionItem,
    middlewares: [withDelay(300)],
});
export const worker = setupWorker(
    http.all(/https:\/\/crm\.api\.marmelab\.com/, handler)
);

export default () => worker;
