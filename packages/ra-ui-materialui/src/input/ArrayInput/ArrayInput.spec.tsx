import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

import { ArrayInput } from './ArrayInput';
import NumberInput from '../NumberInput';
import TextInput from '../TextInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { minLength, required } from 'ra-core';

const theme = createTheme();

describe('<ArrayInput />', () => {
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
            <ThemeProvider theme={theme}>
                <FinalForm
                    render={() => (
                        <form>
                            <ArrayInput source="foo">
                                <SimpleFormIterator />
                            </ArrayInput>
                        </form>
                    )}
                />
            </ThemeProvider>
        );
        expect(baseElement.querySelectorAll('section')).toHaveLength(0);
    });

    it('should create one section subform per value in the array', () => {
        const { baseElement } = render(
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
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
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
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

    it('should apply validation to both itself and its inner inputs', async () => {
        const { getByText, getAllByLabelText, queryByText } = render(
            <ThemeProvider theme={theme}>
                <FinalForm
                    render={() => (
                        <form>
                            <ArrayInput
                                resource="bar"
                                source="arr"
                                validate={[minLength(2, 'array_min_length')]}
                            >
                                <SimpleFormIterator>
                                    <TextInput
                                        source="id"
                                        validate={[required('id_required')]}
                                    />
                                    <TextInput
                                        source="foo"
                                        validate={[required('foo_required')]}
                                    />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </form>
                    )}
                />
            </ThemeProvider>
        );

        fireEvent.click(getByText('ra.action.add'));
        expect(queryByText('array_min_length')).not.toBeNull();
        fireEvent.click(getByText('ra.action.add'));
        const firstId = getAllByLabelText('resources.bar.fields.id *')[0];
        fireEvent.change(firstId, {
            target: { value: 'aaa' },
        });
        fireEvent.change(firstId, {
            target: { value: '' },
        });
        fireEvent.blur(firstId);
        const firstFoo = getAllByLabelText('resources.bar.fields.foo *')[0];
        fireEvent.change(firstFoo, {
            target: { value: 'aaa' },
        });
        fireEvent.change(firstFoo, {
            target: { value: '' },
        });
        fireEvent.blur(firstFoo);
        expect(queryByText('array_min_length')).toBeNull();
        await waitFor(() => {
            expect(queryByText('id_required')).not.toBeNull();
            expect(queryByText('foo_required')).not.toBeNull();
        });
    });
});
