import FakeRest from 'fakerest';
import fetchMock from 'fetch-mock';
import generateData from 'data-generator';

export default () => {
    const data = generateData({ serializeDate: true });
    const restServer = new FakeRest.FetchServer('http://localhost:4000');
    restServer.init(data);
    restServer.toggleLogging(); // logging is off by default, enable it
    fetchMock.mock('begin:http://localhost:4000', restServer.getHandler());
    return () => fetchMock.restore();
};
