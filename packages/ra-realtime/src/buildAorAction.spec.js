import expect from 'expect';
import { FETCH_END } from 'react-admin';

import buildAorAction from './buildAorAction';

describe('buildAorAction', () => {
    it('returns an action correctly configured', () => {
        const payload = 'payload';
        const restType = 'GET_LIST';
        const meta = { prop: 'value' };
        const parsedApolloQueryResult = 'parsedApolloQueryResult';

        expect(
            buildAorAction(
                {
                    type: 'CRUD_GET_LIST',
                    payload,
                    meta: { fetch: restType, ...meta },
                },
                parsedApolloQueryResult
            )
        ).toEqual({
            type: 'CRUD_GET_LIST_SUCCESS',
            payload: parsedApolloQueryResult,
            requestPayload: payload,
            meta: { ...meta, fetchResponse: restType, fetchStatus: FETCH_END },
        });
    });
});
