import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { CoreAdminContext } from '../../core';
import {
    ChoicesProps,
    Form,
    InputProps,
    useChoices,
    useChoicesContext,
    useInput,
} from '../../form';
import { testDataProvider } from '../../dataProvider';
import { ReferenceInputBase } from './ReferenceInputBase';
import {
    SelfReference,
    QueryOptions,
    Meta,
} from './ReferenceInputBase.stories';

describe('<ReferenceInputBase />', () => {
    const defaultProps = {
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    beforeAll(() => {
        window.scrollTo = jest.fn();
    });

    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        /**
         * For some reason, we cannot use the Error story for the test. Although it behaves correctly in storybook,
         * it does not render the error message in the test.
         */
        render(
            <CoreAdminContext
                queryClient={
                    new QueryClient({
                        defaultOptions: { queries: { retry: false } },
                    })
                }
                dataProvider={testDataProvider({
                    getList: () => Promise.reject(new Error('fetch error')),
                })}
            >
                <Form onSubmit={jest.fn()}>
                    <ReferenceInputBase {...defaultProps}>
                        <AutocompleteInput />
                    </ReferenceInputBase>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('fetch error')).not.toBeNull();
        });
    });

    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const { resource } = useChoicesContext();
            return <div>{resource}</div>;
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceInputBase {...defaultProps}>
                        <MyComponent />
                    </ReferenceInputBase>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('posts')).not.toBeNull();
        });
    });

    it('should provide a ChoicesContext with all available choices', async () => {
        const Children = () => {
            const { total } = useChoicesContext();
            return <div aria-label="total">{total}</div>;
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form onSubmit={jest.fn()}>
                    <ReferenceInputBase {...defaultProps}>
                        <Children />
                    </ReferenceInputBase>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });

    it('should accept meta in queryOptions', async () => {
        const getList = jest
            .fn()
            .mockImplementation(() => Promise.resolve({ data: [], total: 25 }));
        const dataProvider = testDataProvider({
            getList,
            // @ts-ignore
            getOne: () => Promise.resolve({ data: { id: 1 } }),
        });
        render(<Meta dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(getList).toHaveBeenCalledWith('authors', {
                filter: {},
                pagination: { page: 1, perPage: 25 },
                sort: { field: 'id', order: 'DESC' },
                meta: { test: true },
                signal: undefined,
            });
        });
    });

    it('should use meta when fetching current value', async () => {
        const getList = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: [], total: 25 })
            );
        const getMany = jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve({ data: [] }));
        const dataProvider = testDataProvider({ getList, getMany });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Form record={{ post_id: 23 }}>
                    <ReferenceInputBase
                        {...defaultProps}
                        queryOptions={{ meta: { foo: 'bar' } }}
                    >
                        <AutocompleteInput />
                    </ReferenceInputBase>
                </Form>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(getMany).toHaveBeenCalledWith('posts', {
                ids: [23],
                meta: { foo: 'bar' },
                signal: undefined,
            });
        });
    });

    it('should pass queryOptions to both queries', async () => {
        render(<QueryOptions />);
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
        expect(screen.queryByDisplayValue('Tolstoy')).toBeNull();
        fireEvent.click(screen.getByText('Toggle queryOptions'));
        await waitFor(() => {
            expect(screen.queryByDisplayValue('Tolstoy')).not.toBeNull();
        });
    });

    it('should not throw an error on save when it is a self reference and the reference is undefined', async () => {
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        render(<SelfReference />);
        fireEvent.click(await screen.findByLabelText('Self reference'));
        await waitFor(() => {
            expect(screen.getAllByRole('option')).toHaveLength(5);
        });
        const titleInput = await screen.findByDisplayValue('War and Peace');
        fireEvent.change(titleInput, {
            target: { value: 'War and Peace 2' },
        });
        screen.getByText('Save').click();
        await screen.findByText('Proust', undefined, { timeout: 5000 });
    });
});

const AutocompleteInput = (
    props: Omit<InputProps, 'source'> &
        Partial<Pick<InputProps, 'source'>> &
        ChoicesProps & { source?: string }
) => {
    const { allChoices, error, source, setFilters } = useChoicesContext(props);
    const { getChoiceValue, getChoiceText } = useChoices(props);
    const { field } = useInput({ ...props, source });

    if (error) {
        return <div style={{ color: 'red' }}>{error.message}</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor={field.name}>{field.name}</label>
            <input type="hidden" id={field.name} {...field} />
            <input
                id={`${source}-search`}
                list={`${source}-choices`}
                onChange={e => {
                    const choice = allChoices?.find(
                        choice =>
                            getChoiceText(choice).toString() === e.target.value
                    );
                    if (choice) {
                        field.onChange(getChoiceValue(choice));
                        return;
                    }
                    setFilters({ q: e.target.value }, {}, true);
                }}
            />

            <datalist id={`${source}-choices`}>
                {allChoices?.map(choice => (
                    <option
                        key={getChoiceValue(choice)}
                        value={getChoiceText(choice).toString()}
                    >
                        {getChoiceText(choice)}
                    </option>
                ))}
            </datalist>
        </div>
    );
};
