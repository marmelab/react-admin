 import {FetchMockAdapter, withDelay} from 'fakerest';
import generateData from '../data-generator-retail/src/index';
import fetchMock from 'fetch-mock';
export default () => {
    const data = generateData();
    const adapter = new FetchMockAdapter({
        baseUrl: 'http://localhost:4000',
        data,
        loggingEnabled: true,
        middlewares: [withDelay(500)],
    });
    if (window) {
        window.restServer = adapter.server; 
    }
    (fetchMock as any).get('begin:http://localhost:4000', adapter.getHandler());
    return () => (fetchMock as any).reset(); 
   
};
