import React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { renderWithRedux, DataProviderContext } from 'ra-core';

import Edit from './Edit';

describe('<Edit />', () => {
    afterEach(cleanup);

    const defaultEditProps = {
        basePath: '/',
        id: '123',
        resource: 'foo',
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
                <Edit {...defaultEditProps} aside={<Aside />}>
                    <Dummy />
                </Edit>
            </DataProviderContext.Provider>,
            { admin: { resources: { foo: { data: {} } } } }
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
