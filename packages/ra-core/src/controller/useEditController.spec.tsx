import React from 'react';
import expect from 'expect';
import { act, cleanup, wait } from '@testing-library/react';

import EditController from './EditController';
import renderWithRedux from '../util/renderWithRedux';
import {
    DataProviderContext,
    convertLegacyDataProvider,
} from '../dataProvider';

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

    it('should grab the record from the store based on the id', async () => {
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
        await wait();
        expect(getByText('hello')).toBeDefined();
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
        const dataProvider = convertLegacyDataProvider(() =>
            Promise.resolve({ data: null })
        );
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditController {...defaultProps} undoable={false}>
                    {({ save }) => {
                        saveCallback = save;
                        return null;
                    }}
                </EditController>
            </DataProviderContext.Provider>
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
