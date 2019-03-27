import React from 'react';
import { shallow } from 'enzyme';

import { UnconnectedCreateController as CreateController } from './CreateController';
import { crudCreate } from '../actions';

describe('CreateController', () => {
    const defaultProps = {
        basePath: '',
        dispatch: jest.fn(),
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        isLoading: false,
        location: {
            pathname: '/foo',
            search: undefined,
            state: undefined,
            hash: undefined,
        },
        match: { isExact: true, path: '/foo', params: undefined, url: '' },
        resource: 'foo',
        title: 'Foo',
        translate: x => x,
    };

    describe('Presetting the record from the location', () => {
        it('should return an empty record by default', () => {
            const childrenMock = jest.fn();
            const props = {
                ...defaultProps,
                children: childrenMock,
            };

            shallow(<CreateController {...props} />);
            expect(childrenMock).toHaveBeenCalledWith(
                expect.objectContaining({ record: {} })
            );
        });

        it('should return location state record when set', () => {
            const childrenMock = jest.fn();
            const props = {
                ...defaultProps,
                children: childrenMock,
                location: {
                    ...defaultProps.location,
                    state: { record: { foo: 'bar' } },
                },
            };

            shallow(<CreateController {...props} />);
            expect(childrenMock).toHaveBeenCalledWith(
                expect.objectContaining({ record: { foo: 'bar' } })
            );
        });

        it('should return location search when set', () => {
            const childrenMock = jest.fn();
            const props = {
                ...defaultProps,
                children: childrenMock,
                location: {
                    ...defaultProps.location,
                    search: '?foo=baz&array[]=1&array[]=2',
                },
            };

            shallow(<CreateController {...props} />);
            expect(childrenMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    record: { foo: 'baz', array: ['1', '2'] },
                })
            );
        });

        it('should return location state record when both state and search are set', () => {
            const childrenMock = jest.fn();
            const props = {
                ...defaultProps,
                children: childrenMock,
                location: {
                    ...defaultProps.location,
                    state: { record: { foo: 'bar' } },
                    search: '?foo=baz',
                },
            };

            shallow(<CreateController {...props} />);
            expect(childrenMock).toHaveBeenCalledWith(
                expect.objectContaining({ record: { foo: 'bar' } })
            );
        });
    });

    describe('Overriding onSave', () => {
        it('Dispatches the default crudCreate action if onSave is not overridden', () => {
            const values = {
                name: 'foo',
            };

            const customSave = jest.fn(() => ({ type: 'CUSTOM_SAVE' }));
            const dispatch = jest.fn();
            const childrenMock = jest.fn(({ onSave }) => {
                onSave(values, 'list');
            });
            const props = {
                ...defaultProps,
                children: childrenMock,
                onSave: customSave,
                dispatch,
            };

            shallow(<CreateController {...props} />);
            expect(customSave).toHaveBeenCalledWith(values, 'list');
            expect(dispatch).toHaveBeenCalledWith({ type: 'CUSTOM_SAVE' });
        });

        it('Allows to override onSave with a function returning an action and dispatches this action', () => {
            const values = {
                name: 'foo',
            };

            const dispatch = jest.fn();
            const childrenMock = jest.fn(({ onSave }) => {
                onSave(values, 'list');
            });
            const props = {
                ...defaultProps,
                children: childrenMock,
                dispatch,
            };

            shallow(<CreateController {...props} />);
            expect(dispatch).toHaveBeenCalledWith(
                crudCreate(
                    defaultProps.resource,
                    values,
                    defaultProps.basePath,
                    'list'
                )
            );
        });

        it('Allows to override onSave with a function returning nothing', () => {
            const values = {
                name: 'foo',
            };

            const customSave = jest.fn();
            const dispatch = jest.fn();
            const childrenMock = jest.fn(({ onSave }) => {
                onSave(values, 'list');
            });
            const props = {
                ...defaultProps,
                children: childrenMock,
                onSave: customSave,
                dispatch,
            };

            shallow(<CreateController {...props} />);
            expect(customSave).toHaveBeenCalledWith(values, 'list');
            expect(dispatch).not.toHaveBeenCalled();
        });
    });
});
