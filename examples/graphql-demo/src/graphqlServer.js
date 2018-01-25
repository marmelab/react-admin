import fetchMock from 'fetch-mock';
import JsonGraphqlServer from 'json-graphql-server';
import generateData from 'data-generator';

export default () => {
    const data = generateData();
    const restServer = JsonGraphqlServer({ data });
    const handler = restServer.getHandler();

    fetchMock.mock('^http://localhost:4000', handler);
    return () => fetchMock.restore();
};
