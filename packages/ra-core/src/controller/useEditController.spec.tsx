import React from 'react';
import expect from 'expect';
import { act, cleanup } from 'react-testing-library';

import EditController from './EditController';
import renderWithRedux from '../util/renderWithRedux';

describe('useEditController', () => {
    afterEach(cleanup);

    const defaultProps = {
        basePath: '',
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    it('should query the data provider for the record using a GET_ONE query', () => {
        const { dispatch } = renderWithRedux(
            <EditController {...defaultProps}>
                {({ record }) => <div>{record && record.title}</div>}
            </EditController>
        );
        const crudGetOneAction = dispatch.mock.calls[0][0];
        expect(crudGetOneAction.type).toEqual('RA/CRUD_GET_ONE');
        expect(crudGetOneAction.payload).toEqual({ id: 12 });
        expect(crudGetOneAction.meta.resource).toEqual('posts');
    });

    it('should grab the record from the store based on the id', () => {
        const { getByText } = renderWithRedux(
            <EditController {...defaultProps}>
                {({ record }) => <div>{record && record.title}</div>}
            </EditController>,
            {
                admin: {
                    resources: {
                        posts: { data: { 12: { id: 12, title: 'hello' } } },
                    },
                },
            }
        );
        expect(getByText('hello')).toBeDefined();
    });

    it('should reset the redux form', () => {
        const { dispatch } = renderWithRedux(
            <EditController {...defaultProps}>
                {({ record }) => <div>{record && record.title}</div>}
            </EditController>
        );
        const formResetAction = dispatch.mock.calls[3][0];
        expect(formResetAction.type).toEqual('@@redux-form/RESET');
        expect(formResetAction.meta).toEqual({ form: 'record-form' });
    });

    it('should return an undoable save callback by default', () => {
        let saveCallback;
        const { dispatch } = renderWithRedux(
            <EditController {...defaultProps}>
                {({ save }) => {
                    saveCallback = save;
                    return null;
                }}
            </EditController>
        );
        act(() => saveCallback({ foo: 'bar' }));
        const call = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_UPDATE_OPTIMISTIC'
        );
        expect(call).not.toBeUndefined();
        const crudUpdateAction = call[0];
        expect(crudUpdateAction.payload).toEqual({
            id: 12,
            data: { foo: 'bar' },
            previousData: null,
        });
        expect(crudUpdateAction.meta.resource).toEqual('posts');
    });

    it('should return a save callback when undoable is false', () => {
        let saveCallback;
        const { dispatch } = renderWithRedux(
            <EditController {...defaultProps} undoable={false}>
                {({ save }) => {
                    saveCallback = save;
                    return null;
                }}
            </EditController>
        );
        act(() => saveCallback({ foo: 'bar' }));
        const call = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_UPDATE_OPTIMISTIC'
        );
        expect(call).toBeUndefined();
        const call2 = dispatch.mock.calls.find(
            params => params[0].type === 'RA/CRUD_UPDATE'
        );
        expect(call2).not.toBeUndefined();
        const crudUpdateAction = call2[0];
        expect(crudUpdateAction.payload).toEqual({
            id: 12,
            data: { foo: 'bar' },
            previousData: null,
        });
        expect(crudUpdateAction.meta.resource).toEqual('posts');
    });
});
