import * as React from 'react';
import {
    render,
    screen,
    waitFor,
    within,
    fireEvent,
} from '@testing-library/react';
import { testDataProvider, useListContext } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { Datagrid } from '../list';
import { TextField } from '../field';
import {
    ReferenceArrayInput,
    ReferenceArrayInputView,
} from './ReferenceArrayInput';

describe('<ReferenceArrayInput />', () => {
    const defaultProps = {
        field: {},
        fieldState: {},
        record: {},
        reference: 'tags',
        resource: 'posts',
        source: 'tag_ids',
        translate: x => `*${x}*`,
    };

    afterEach(async () => {
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    it('should display an error if error is defined', () => {
        const MyComponent = () => <div>MyComponent</div>;
        const { queryByDisplayValue, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    error: 'error',
                    field: {},
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByDisplayValue('error')).not.toBeNull();
        expect(queryByText('MyComponent')).toBeNull();
    });

    it('should send an error to the children if warning is defined', () => {
        const MyComponent = ({ fieldState }) => (
            <div>{fieldState.helperText}</div>
        );
        const { queryByText, queryByRole } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    warning: 'fetch error',
                    field: { value: [1, 2] },
                    choices: [{ id: 2 }],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText('fetch error')).not.toBeNull();
    });

    it('should not send an error to the children if warning is not defined', () => {
        const MyComponent = ({ fieldState }) => (
            <div>{JSON.stringify(fieldState)}</div>
        );
        const { queryByText, queryByRole } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    field: { value: [1, 2] },
                    choices: [{ id: 1 }, { id: 2 }],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(
            queryByText(JSON.stringify({ helperText: false }))
        ).not.toBeNull();
    });

    it('should render enclosed component if references present in input are available in state', () => {
        const MyComponent = ({ choices }) => (
            <div>{JSON.stringify(choices)}</div>
        );
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    field: { value: [1] },
                    choices: [1],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText(JSON.stringify([1]))).not.toBeNull();
    });

    it('should render enclosed component even if the choices are empty', () => {
        const MyComponent = ({ choices }) => (
            <div>{JSON.stringify(choices)}</div>
        );
        const { queryByRole, queryByText } = render(
            <ReferenceArrayInputView
                {...{
                    ...defaultProps,
                    choices: [],
                }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(queryByRole('progressbar')).toBeNull();
        expect(queryByRole('textbox')).toBeNull();
        expect(queryByText(JSON.stringify([]))).not.toBeNull();
    });

    it('should pass the correct resource down to child component', () => {
        let resourceProp;
        const MyComponent = ({ resource }) => {
            resourceProp = resource;
            return <div />;
        };
        const onChange = jest.fn();
        render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(resourceProp).toEqual('tags');
    });

    it('should pass onChange down to child component', () => {
        let onChangeCallback;
        const MyComponent = ({ onChange }) => {
            onChangeCallback = onChange;
            return <div />;
        };
        const onChange = jest.fn();
        render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                onChange={onChange}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        onChangeCallback('foo');
        expect(onChange).toBeCalledWith('foo');
    });

    it('should pass fieldState down to child component', () => {
        const MyComponent = ({ fieldState }) => (
            <div>{JSON.stringify(fieldState)}</div>
        );
        const { queryByText } = render(
            <ReferenceArrayInputView
                {...defaultProps}
                allowEmpty
                fieldState={{ isTouched: false }}
            >
                <MyComponent />
            </ReferenceArrayInputView>
        );
        expect(
            queryByText(JSON.stringify({ isTouched: false, helperText: false }))
        ).not.toBeNull();
    });

    it('should provide a ListContext with all available choices', async () => {
        const Children = () => {
            const { total } = useListContext();
            return <div aria-label="total">{total}</div>;
        };
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceArrayInput {...defaultProps}>
                        <Children />
                    </ReferenceArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });

    it('should allow to use a Datagrid', async () => {
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({
                    data: [
                        { id: 5, name: 'test1' },
                        { id: 6, name: 'test2' },
                    ],
                    total: 2,
                }),
            getMany: () =>
                Promise.resolve({
                    data: [{ id: 5, name: 'test1' }],
                }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    defaultValues={{ tag_ids: [5] }}
                >
                    <ReferenceArrayInput
                        reference="tags"
                        resource="posts"
                        source="tag_ids"
                    >
                        <Datagrid rowClick="toggleSelection">
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            screen.getByText('test1');
            screen.getByText('test2');
        });

        const getCheckbox1 = () =>
            within(screen.queryByText('test1').closest('tr'))
                .getByLabelText('ra.action.select_row')
                .querySelector('input');
        const getCheckbox2 = () =>
            within(screen.queryByText('test2').closest('tr'))
                .getByLabelText('ra.action.select_row')
                .querySelector('input');
        const getCheckboxAll = () =>
            screen
                .getByLabelText('ra.action.select_all')
                .querySelector('input');

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(true);
            expect(getCheckbox2().checked).toEqual(false);
        });

        fireEvent.click(getCheckbox2());

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(true);
            expect(getCheckbox2().checked).toEqual(true);
            expect(getCheckboxAll().checked).toEqual(true);
        });

        fireEvent.click(getCheckboxAll());

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(false);
            expect(getCheckbox2().checked).toEqual(false);
            expect(getCheckboxAll().checked).toEqual(false);
        });

        fireEvent.click(getCheckboxAll());

        await waitFor(() => {
            expect(getCheckbox1().checked).toEqual(true);
            expect(getCheckbox2().checked).toEqual(true);
            expect(getCheckboxAll().checked).toEqual(true);
        });
    });
});
