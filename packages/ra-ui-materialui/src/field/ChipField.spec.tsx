import * as React from 'react';
import expect from 'expect';
import ChipField from './ChipField';
import { render, cleanup } from '@testing-library/react';

describe('<ChipField />', () => {
    afterEach(cleanup);

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

    it('should render concatenated sources if many given', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source={['firstName', 'lastName']}
                record={{ id: 123, firstName: 'John', lastName: 'Doe' }}
            />
        );
        expect(getByText('John Doe')).not.toBeNull();
    });


    it('should render concatenated with join glue if set', () => {
        const { getByText } = render(
            <ChipField
                className="className"
                classes={{}}
                source={['lastName', 'firstName']}
                record={{ id: 123, firstName: 'John', lastName: 'Doe' }}
                join=", "
            />
        );
        expect(getByText('Doe, John')).not.toBeNull();
    });

});
