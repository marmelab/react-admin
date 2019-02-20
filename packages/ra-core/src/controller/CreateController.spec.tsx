import React from 'react';
import { shallow } from 'enzyme';

import { UnconnectedCreateController as CreateController } from './CreateController';

describe('CreateController', () => {
    describe('Presetting the record from the location', () => {
        const defaultProps = {
            basePath: '',
            crudCreate: jest.fn(),
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
});
