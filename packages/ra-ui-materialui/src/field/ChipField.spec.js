import React from 'react';
import expect from 'expect';
import { ChipField } from './ChipField';
import { render, cleanup } from '@testing-library/react';

describe('<ChipField />', () => {
    afterEach(cleanup);

    it('should display the record value added as source', () => {
        const { getByAttribute } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ name: 'foo' }}
            />
        );

        expect(getByAttribute('label')).toEqual('foo');
    });

    it('should not display any label added as props', () => {
        const { getByAttribute } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ name: 'foo' }}
                label="bar"
            />
        );

        expect(getByAttribute('label')).toEqual('foo');
    });
});
