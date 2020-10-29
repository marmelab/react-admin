import * as React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { renderWithRedux, DataProviderContext } from 'ra-core';

import { Show } from './Show';

describe('<Show />', () => {
    afterEach(cleanup);

    const initialState = {
        admin: {
            resources: {
                posts: { data: {}, props: { name: 'posts' } },
            },
        },
    };

    const defaultShowProps = {
        basePath: '/posts',
        id: '123',
        resource: 'posts',
        location: {},
        match: {},
    };

    it('should display aside component', () => {
        const Aside = () => <div id="aside">Hello</div>;
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 123 } }),
        };
        const Dummy = () => <div />;
        const { queryAllByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Show {...defaultShowProps} aside={<Aside />}>
                    <Dummy />
                </Show>
            </DataProviderContext.Provider>,
            initialState
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
