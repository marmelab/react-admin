import fetchMock from 'fetch-mock';
import JsonGraphqlServer from 'json-graphql-server';
import data from './data';

export default () => {
    const restServer = JsonGraphqlServer({ data });
    fetchMock.mock('^http://localhost:3000', restServer.getHandler());
    return () => fetchMock.restore();
};
