import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { FormWithRedirect, minLength, required } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { ArrayInput } from './ArrayInput';
import { NumberInput } from '../NumberInput';
import { TextInput } from '../TextInput';
import { SimpleFormIterator } from './SimpleFormIterator';

const theme = createTheme();

describe.only('<ArrayInput />', () => {
    it('should pass its record props to its child', () => {
        const MockChild = jest.fn(() => <span />);

        renderWithRedux(
            <FormWithRedirect
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

    it('should not create any section subform when the value is undefined', () => {
        const { baseElement } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <FormWithRedirect
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
        const { baseElement } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <FormWithRedirect
                    defaultValues={{
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
        const defaultValues = {
            arr: [
                { id: 123, foo: 'bar' },
                { id: 456, foo: 'baz' },
            ],
        };
        const { queryAllByLabelText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <FormWithRedirect
                    defaultValues={defaultValues}
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

    // FIXME: Restore if we can apply validation on the ArrayInput itself
    it.skip('should apply validation to both itself and its inner inputs', async () => {
        const { getByText, getAllByLabelText, queryByText } = renderWithRedux(
            <ThemeProvider theme={theme}>
                <FormWithRedirect
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
