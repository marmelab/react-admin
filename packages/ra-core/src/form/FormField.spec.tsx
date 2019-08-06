import React from 'react';
import { Form } from 'react-final-form';
import { render, cleanup } from '@testing-library/react';
import FormField from './FormField';

describe('<FormField>', () => {
    afterEach(cleanup);

    const Foo = ({ input }) => <div aria-label={input.name} />;
    it('should inject input props if not already specified', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <FormField source="title" component={Foo} />}
            />
        );
        expect(queryByLabelText('title')).not.toBeNull();
    });

    it('should inject input props if already specified', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <FormField
                        source="title"
                        component={Foo}
                        input={{ name: 'foo' }}
                    />
                )}
            />
        );
        expect(queryByLabelText('title')).toBeNull();
        expect(queryByLabelText('foo')).not.toBeNull();
    });
});
