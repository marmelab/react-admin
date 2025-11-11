import {
    fetchActionsWithRecordResponse,
    fetchActionsWithArrayOfIdentifiedRecordsResponse,
    fetchActionsWithArrayOfRecordsResponse,
    fetchActionsWithTotalResponse,
} from './dataFetchActions';

function validateResponseFormat(response, type, logger = console.error) {
    if (!response) {
        logger(`The dataProvider returned an empty response for '${type}'.`);
        throw new Error('ra.notification.data_provider_error');
    }
    if (!Object.prototype.hasOwnProperty.call(response, 'data')) {
        logger(
            `The response to '${type}' must be like { data: ... }, but the received response does not have a 'data' key. The dataProvider is probably wrong for '${type}'.`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithArrayOfRecordsResponse.includes(type) &&
        !Array.isArray(response.data)
    ) {
        logger(
            `The response to '${type}' must be like { data : [...] }, but the received data is not an array. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithArrayOfIdentifiedRecordsResponse.includes(type) &&
        Array.isArray(response.data) &&
        response.data.length > 0 &&
        !Object.prototype.hasOwnProperty.call(response.data[0], 'id')
    ) {
        logger(
            `The response to '${type}' must be like { data : [{ id: 123, ...}, ...] }, but the received data items do not have an 'id' key. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithRecordResponse.includes(type) &&
        !Object.prototype.hasOwnProperty.call(response.data, 'id')
    ) {
        logger(
            `The response to '${type}' must be like { data: { id: 123, ... } }, but the received data does not have an 'id' key. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithTotalResponse.includes(type) &&
        !Object.prototype.hasOwnProperty.call(response, 'total') &&
        !Object.prototype.hasOwnProperty.call(response, 'pageInfo')
    ) {
        logger(
            `The response to '${type}' must be like { data: [...], total: 123 } or { data: [...], pageInfo: {...} }, but the received response has neither a 'total' nor a 'pageInfo' key. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
}

export default validateResponseFormat;
