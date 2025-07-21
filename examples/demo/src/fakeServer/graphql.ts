import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import { getMswHandler } from 'fakerest';
import generateData from 'data-generator-retail';

const data = generateData();
const handler = getMswHandler({
    baseUrl: 'http://localhost:4000',
    data,
});

export const worker = setupWorker(http.all(/http:\/\/localhost:4000/, handler));

export default () => worker;
