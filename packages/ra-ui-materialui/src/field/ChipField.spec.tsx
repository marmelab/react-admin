import * as React from 'react';
import expect from 'expect';
import ChipField from './ChipField';
import { render } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';

describe('<ChipField />', () => {
    it('should display the record value added as source', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ id: 123, name: 'foo' }}
            />
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it('should use record from RecordContext', () => {
        const { getByText } = render(
            <RecordContextProvider value={{ id: 123, name: 'foo' }}>
                <ChipField className="className" classes={{}} source="name" />
            </RecordContextProvider>
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it('should not display any label added as props', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source="name"
                record={{ id: 123, name: 'foo' }}
                label="bar"
            />
        );
        expect(getByText('foo')).not.toBeNull();
    });

    it.each([null, undefined])(
        'should render the emptyText when value is %s',
        name => {
            const { getByText } = render(
                <ChipField
                    className="className"
                    classes={{}}
                    source="name"
                    record={{ id: 123, name }}
                    emptyText="NA"
                />
            );
            expect(getByText('NA')).not.toBeNull();
        }
    );
});
