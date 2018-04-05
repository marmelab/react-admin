import { FETCH_END } from 'react-admin';

import buildAction from './buildAction';

describe('buildAction', () => {
    it('returns an action correctly configured', () => {
        const requestPayload = 'payload';
        const restType = 'GET_LIST';
        const meta = { prop: 'value' };
        const payload = 'payload';

        expect(
            buildAction(
                {
                    type: 'CRUD_GET_LIST',
                    payload: requestPayload,
                    meta: { fetch: restType, ...meta },
                },
                payload
            )
        ).toEqual({
            type: 'CRUD_GET_LIST_SUCCESS',
            payload,
            requestPayload,
            meta: { ...meta, fetchResponse: restType, fetchStatus: FETCH_END },
        });
    });
});
