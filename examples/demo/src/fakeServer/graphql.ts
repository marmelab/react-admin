import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import JsonGraphqlServer from 'json-graphql-server';
import generateData from 'data-generator-retail';

const data = generateData();
const restServer = JsonGraphqlServer({ data });
const handler = restServer.getHandler();

export const worker = setupWorker(http.all(/http:\/\/localhost:4000/, handler));

export default () => worker;
