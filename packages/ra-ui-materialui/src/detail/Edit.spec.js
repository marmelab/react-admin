import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import { renderWithRedux } from 'ra-core';

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
        const { queryAllByText } = renderWithRedux(
            <Edit {...defaultEditProps} aside={<Aside />}>
                <div />
            </Edit>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
