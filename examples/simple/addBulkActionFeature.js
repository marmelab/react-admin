import { BULK_ACTION, UPDATE, DELETE } from 'react-admin';
export default next => (type, resource, params) => {
    switch (type) {
        case BULK_ACTION: {
            const { action, ids, previousData, data } = params;
            switch (action) {
                case UPDATE: {
                    const updateAll = ids.map(id =>
                        next(UPDATE, resource, {
                            id,
                            previousData: previousData[id],
                            data,
                        })
                            .then(response => ({ resolved: response }))
                            .catch(error => ({ rejected: error }))
                    );
                    return Promise.all(updateAll).then(responses => ({
                        data: responses,
                    }));
                }
                case DELETE: {
                    const deleteAll = ids.map(id =>
                        next(DELETE, resource, {
                            id,
                            previousData: previousData[id],
                        })
                            .then(response => ({ resolved: response }))
                            .catch(error => ({ rejected: error }))
                    );
                    return Promise.all(deleteAll).then(responses => ({
                        data: responses,
                    }));
                }
                default:
                    // Pass all other bulk actions down to the provider
                    return next(type, resource, params);
            }
        }
        default:
            return next(type, resource, params);
    }
};
