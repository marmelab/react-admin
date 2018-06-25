import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';

import { handleRedirection } from './redirection';
import { REDUX_FORM_NAME } from '../form';

describe('redirection saga', () => {
    it('should yield a redirection if redirectTo is truthy', () => {
        const action = {
            payload: { id: 123 },
            meta: { redirectTo: 'edit', basePath: '/posts' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(push('/posts/123')));
    });

    it('should yield a redirection using the payload data if available', () => {
        const action = {
            payload: { data: { id: 123 } },
            meta: { redirectTo: 'edit', basePath: '/posts' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(push('/posts/123')));
    });

    it('should yield a redirection using the request payload if available', () => {
        const action = {
            requestPayload: { id: 123 },
            meta: { redirectTo: 'edit', basePath: '/posts' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(push('/posts/123')));
    });

    it('should yield a form refresh if redirectTo is falsy', () => {
        const action = {
            meta: { redirectTo: false },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(reset(REDUX_FORM_NAME)));
    });

    it('should yield a form refresh with a custom name if redirectTo is falsy', () => {
        const action = {
            meta: { redirectTo: false, formName: 'custom-form' },
        };
        const generator = handleRedirection(action);
        expect(generator.next().value).toEqual(put(reset('custom-form')));
    });
});
