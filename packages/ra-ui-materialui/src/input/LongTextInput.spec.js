import React from 'react';
import assert from 'assert';
import { render, cleanup } from 'react-testing-library';

import { LongTextInput } from './LongTextInput';

describe('<LongTextInput />', () => {
    afterEach(cleanup);
    const defaultProps = {
        source: 'foo',
        resource: 'bar',
        meta: {},
        input: {
            value: '',
        },
        onChange: jest.fn(),
    };

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <LongTextInput
                    {...defaultProps}
                    meta={{ touched: false, error: 'Required field.' }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { queryByText } = render(
                <LongTextInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByText } = render(
                <LongTextInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const error = getByText('Required field.');
            assert.ok(error);
        });
    });
});
