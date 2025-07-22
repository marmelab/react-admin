import JsonGraphqlServer from 'json-graphql-server';
import generateData from 'data-generator-retail';
import { HttpResponse, HttpResponseResolver } from 'msw';

export default (): HttpResponseResolver => {
    const data = generateData();
    const server = JsonGraphqlServer({ data });
    const graphqlHandler = server.getHandler();

    // Temporary workaround for MSW's graphql handler because json-graphql-server is not yet compatible with MSW
    const handler: HttpResponseResolver = async ({ request }) => {
        const body = await request.text();
        const result = await graphqlHandler({
            requestBody: body,
        });

        return HttpResponse.json(JSON.parse(result.body));
    };

    return handler;
};
