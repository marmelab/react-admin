import React from 'react';
import { render, cleanup } from 'react-testing-library';

import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    afterEach(cleanup);

<<<<<<< HEAD
    const defaultProps = {
        resource: 'foo',
        meta: {},
    };

||||||| merged common ancestors
=======
    const defaultProps = {
        id: 'bar',
        resource: 'foo',
        source: 'bar',
        input: {},
        meta: {},
    };

>>>>>>> Migrated BooleanInput
    it('should render as a checkbox', () => {
<<<<<<< HEAD
        const { getByLabelText } = render(
            <BooleanInput {...defaultProps} source="bar" input={{}} />
        );
||||||| merged common ancestors
        const { getByLabelText } = render(
            <BooleanInput resource="foo" source="bar" input={{}} />
        );
=======
        const { getByLabelText } = render(<BooleanInput {...defaultProps} />);
>>>>>>> Migrated BooleanInput
        expect(getByLabelText('resources.foo.fields.bar').type).toBe(
            'checkbox'
        );
    });

    it('should be checked if the value is true', () => {
        const { getByLabelText } = render(
<<<<<<< HEAD
            <BooleanInput
                {...defaultProps}
                source="bar"
                input={{ value: true }}
            />
||||||| merged common ancestors
            <BooleanInput resource="foo" source="bar" input={{ value: true }} />
=======
            <BooleanInput {...defaultProps} input={{ value: true }} />
>>>>>>> Migrated BooleanInput
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        const { getByLabelText } = render(
<<<<<<< HEAD
            <BooleanInput
                {...defaultProps}
                source="bar"
                input={{ value: false }}
            />
||||||| merged common ancestors
            <BooleanInput
                resource="foo"
                source="bar"
                input={{ value: false }}
            />
=======
            <BooleanInput {...defaultProps} input={{ value: false }} />
>>>>>>> Migrated BooleanInput
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        const { getByLabelText } = render(
<<<<<<< HEAD
            <BooleanInput {...defaultProps} source="bar" input={{}} />
||||||| merged common ancestors
            <BooleanInput resource="foo" source="bar" input={{}} />
=======
            <BooleanInput {...defaultProps} input={{}} />
>>>>>>> Migrated BooleanInput
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(false);
    });

    it('should displays errors', () => {
        const { queryAllByText } = render(
            <BooleanInput
                {...defaultProps}
                source="foo"
                input={{}}
                meta={{ error: 'foobar' }}
            />
        );
        expect(queryAllByText('foobar')).toHaveLength(1);
    });
});
