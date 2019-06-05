import buildVariables from './buildVariables';
import buildGqlQuery from './buildGqlQuery';
import getResponseParser from './getResponseParser';

export const buildQueryFactory = (
    buildVariablesImpl,
    buildGqlQueryImpl,
    getResponseParserImpl
) => introspectionResults => {
    const knownResources = introspectionResults.resources.map(r => r.type.name);

    return (aorFetchType, resourceName, params) => {
        const resource = introspectionResults.resources.find(r => r.type.name === resourceName);

        if (!resource) {
            throw new Error(
                `Unknown resource ${resourceName}. Make sure it has been declared on your server side schema. Known resources are ${knownResources.join(
                    ', '
                )}`
            );
        }

        const queryType = resource[aorFetchType];

        if (!queryType) {
            throw new Error(
                `No query or mutation matching fetch type ${aorFetchType} could be found for resource ${
                    resource.type.name
                }`
            );
        }

        const variables = buildVariablesImpl(introspectionResults)(resource, aorFetchType, params, queryType);
        const query = buildGqlQueryImpl(introspectionResults)(resource, aorFetchType, queryType, variables);
        const parseResponse = getResponseParserImpl(introspectionResults)(aorFetchType, resource, queryType);

        return {
            query,
            variables,
            parseResponse,
        };
    };
};

export default buildQueryFactory(buildVariables, buildGqlQuery, getResponseParser);
