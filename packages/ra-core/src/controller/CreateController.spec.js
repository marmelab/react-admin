import React from 'react';
import { shallow } from 'enzyme';

import { CreateController } from './CreateController';

describe('CreateController', () => {
    describe('Presetting the record from the location', () => {
        const defaultProps = {
            basePath: '',
            crudCreate: () => {},
            isLoading: false,
            location: {},
            match: {},
            resource: 'foo',
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
                location: { state: { record: { foo: 'bar' } } },
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
                location: { search: '?foo=baz' },
            };

            shallow(<CreateController {...props} />);
            expect(childrenMock).toHaveBeenCalledWith(
                expect.objectContaining({ record: { foo: 'baz' } })
            );
        });

        it('should return location state record when both state and search are set', () => {
            const childrenMock = jest.fn();
            const props = {
                ...defaultProps,
                children: childrenMock,
                location: {
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
