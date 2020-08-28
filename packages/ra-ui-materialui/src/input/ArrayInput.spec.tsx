import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import ArrayInput from './ArrayInput';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import SimpleFormIterator from '../form/SimpleFormIterator';

describe('<ArrayInput />', () => {
    afterEach(cleanup);

    const onSubmit = jest.fn();
    const mutators = { ...arrayMutators };

    const FinalForm = props => (
        <Form onSubmit={onSubmit} mutators={mutators} {...props} />
    );

    it('should pass its record props to its child', () => {
        const MockChild = jest.fn(() => <span />);

        render(
            <FinalForm
                render={() => (
                    <form>
                        <ArrayInput source="foo" record={{ iAmRecord: true }}>
                            <MockChild />
                        </ArrayInput>
                    </form>
                )}
            />
        );
        expect(MockChild.mock.calls[0][0].record).toEqual({
            iAmRecord: true,
        });
    });

    it('should pass final form array mutators to child', () => {
        const MockChild = jest.fn(() => <span />);
        render(
            <FinalForm
                initialValues={{
                    foo: [{ id: 1 }, { id: 2 }],
                }}
                render={() => (
                    <form>
                        <ArrayInput source="foo">
                            <MockChild />
                        </ArrayInput>
                    </form>
                )}
            />
        );

        expect(MockChild.mock.calls[0][0].fields.value).toEqual([
            { id: 1 },
            { id: 2 },
        ]);
    });

    it('should not create any section subform when the value is undefined', () => {
        const { baseElement } = render(
            <FinalForm
                render={() => (
                    <form>
                        <ArrayInput source="foo">
                            <SimpleFormIterator />
                        </ArrayInput>
                    </form>
                )}
            />
        );
        expect(baseElement.querySelectorAll('section')).toHaveLength(0);
    });

    it('should create one section subform per value in the array', () => {
        const { baseElement } = render(
            <FinalForm
                initialValues={{
                    foo: [{}, {}, {}],
                }}
                render={() => (
                    <form>
                        <ArrayInput source="foo">
                            <SimpleFormIterator />
                        </ArrayInput>
                    </form>
                )}
            />
        );
        expect(baseElement.querySelectorAll('section')).toHaveLength(3);
    });

    it('should clone each input once per value in the array', () => {
        const initialValues = {
            arr: [
                { id: 123, foo: 'bar' },
                { id: 456, foo: 'baz' },
            ],
        };
        const { queryAllByLabelText } = render(
            <FinalForm
                initialValues={initialValues}
                render={() => (
                    <form>
                        <ArrayInput resource="bar" source="arr">
                            <SimpleFormIterator>
                                <NumberInput source="id" />
                                <TextInput source="foo" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </form>
                )}
            />
        );
        expect(queryAllByLabelText('resources.bar.fields.id')).toHaveLength(2);
        expect(
            queryAllByLabelText('resources.bar.fields.id').map(
                input => input.value
            )
        ).toEqual(['123', '456']);
        expect(queryAllByLabelText('resources.bar.fields.foo')).toHaveLength(2);
        expect(
            queryAllByLabelText('resources.bar.fields.foo').map(
                input => input.value
            )
        ).toEqual(['bar', 'baz']);
    });
});
