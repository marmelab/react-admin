import expect from 'expect';
import { put } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { handleRedirection } from './redirection';
import { refreshView } from '../actions/uiActions';

describe('redirection saga', () => {
    it('should yield a refresh of the view if redirectTo is falsy', () => {
        const action = {
            type: 'foo',
            payload: { id: 123 },
            meta: { redirectTo: false, basePath: '/posts' },
        };
        // @ts-ignore
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(refreshView()));
    });

    it('should yield a redirection if redirectTo is truthy', () => {
        const action = {
            type: 'foo',
            payload: { id: 123 },
            meta: { redirectTo: 'edit', basePath: '/posts' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(push('/posts/123')));
    });

    it('should yield a redirection using the payload data if available', () => {
        const action = {
            type: 'foo',
            payload: { data: { id: 123 } },
            meta: { redirectTo: 'edit', basePath: '/posts' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(push('/posts/123')));
    });

    it('should yield a redirection using the request payload if available', () => {
        const action = {
            type: 'foo',
            requestPayload: { id: 123 },
            meta: { redirectTo: 'edit', basePath: '/posts' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(push('/posts/123')));
    });
});
