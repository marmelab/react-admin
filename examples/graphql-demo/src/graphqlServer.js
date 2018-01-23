import fetchMock from 'fetch-mock';
import JsonGraphqlServer from 'json-graphql-server';
import data from './data';

export default () => {
    const restServer = JsonGraphqlServer({ data });
    const handler = restServer.getHandler();

    fetchMock.mock('^http://localhost:4000', handler);
    return () => fetchMock.restore();
};
