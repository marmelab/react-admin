import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { ListContextProvider, ListControllerResult } from 'ra-core';

import { InfinitePagination } from './InfinitePagination';

describe('<InfinitePagination />', () => {
    it('should throw an error when used outside of an InfiniteList', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() =>
            render(
                <ListContextProvider
                    value={{ isPending: false } as ListControllerResult}
                >
                    <InfinitePagination />
                </ListContextProvider>
            )
        ).toThrow(
            'InfinitePagination must be used inside an InfinitePaginationContext'
        );
    });
});
