import { FetchMockAdapter, withDelay } from 'fakerest';
import fetchMock from 'fetch-mock';
import generateData from 'data-generator-retail';

export default () => {
    const data = generateData();
    const adapter = new FetchMockAdapter({
        baseUrl: 'http://localhost:4000',
        data,
        loggingEnabled: true,
        middlewares: [withDelay(500)],
    });
    if (window) {
        window.restServer = adapter.server; // give way to update data in the console
    }
    fetchMock.mock('begin:http://localhost:4000', adapter.getHandler());
    return () => fetchMock.restore();
};
