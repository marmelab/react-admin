import { MswAdapter, withDelay } from 'fakerest';
import generateData from 'data-generator-retail';

export default () => {
    const data = generateData();
    const adapter = new MswAdapter({
        baseUrl: 'http://localhost:4000',
        data,
        loggingEnabled: true,
        middlewares: [withDelay(500)],
    });
    if (window) {
        window.restServer = adapter.server; // give way to update data in the console
    }
    return adapter.getHandler();
};
