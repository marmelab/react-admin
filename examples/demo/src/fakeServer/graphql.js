import JsonGraphqlServer from 'json-graphql-server';
import generateData from 'data-generator';
import fetchMock from 'fetch-mock';

export default () => {
    const data = generateData();
    const restServer = JsonGraphqlServer({ data });
    const handler = restServer.getHandler();

    fetchMock.mock('begin:http://localhost:4000', handler);
    return () => fetchMock.restore();
};
