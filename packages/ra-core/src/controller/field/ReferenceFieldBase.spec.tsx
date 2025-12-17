import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext } from '../../core/CoreAdminContext';
import { useResourceContext } from '../../core/useResourceContext';
import { testDataProvider } from '../../dataProvider';
import { ReferenceFieldBase } from './ReferenceFieldBase';
import {
    Basic,
    Errored,
    Loading,
    Meta,
    Offline,
    WithRenderProp,
    ZeroIndex,
} from './ReferenceFieldBase.stories';
import { RecordContextProvider } from '../record';
import { onlineManager } from '@tanstack/react-query';

describe('<ReferenceFieldBase />', () => {
    beforeAll(() => {
        window.scrollTo = jest.fn();
    });
    beforeEach(() => {
        onlineManager.setOnline(true);
    });

    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        render(<Errored />);
        await waitFor(() => {
            expect(screen.queryByText('Error: Error')).not.toBeNull();
        });
    });

    it('should pass the loading state', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        render(<Loading />);
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeNull();
        });
    });

    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const resource = useResourceContext();
            return <div>{resource}</div>;
        };
        const dataProvider = testDataProvider({
            getMany: () =>
                // @ts-ignore
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <RecordContextProvider value={{ post_id: 1 }}>
                    <ReferenceFieldBase reference="posts" source="post_id">
                        <MyComponent />
                    </ReferenceFieldBase>
                </RecordContextProvider>
            </CoreAdminContext>
        );
        await screen.findByText('posts');
    });

    it('should accept meta in queryOptions', async () => {
        const getMany = jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve({ data: [], total: 25 })
            );
        const dataProvider = testDataProvider({
            getMany,
            getOne: () =>
                // @ts-ignore
                Promise.resolve({
                    data: {
                        id: 1,
                        title: 'War and Peace',
                        author: 1,
                        summary:
                            "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                        year: 1869,
                    },
                }),
        });
        render(<Meta dataProvider={dataProvider} />);
        await screen.findByText('War and Peace');
        await waitFor(() => {
            expect(getMany).toHaveBeenCalledWith('authors', {
                ids: [1],
                meta: { test: true },
                signal: undefined,
            });
        });
    });

    it('should render the data', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.queryByText('Leo')).not.toBeNull();
        });
    });

    describe('with render prop', () => {
        it('should display an error if error is defined', async () => {
            jest.spyOn(console, 'error')
                .mockImplementationOnce(() => {})
                .mockImplementationOnce(() => {});

            const dataProviderWithAuthorsError = {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 1,
                            title: 'War and Peace',
                            author: 1,
                            summary:
                                "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                            year: 1869,
                        },
                    }),
                getMany: _resource => Promise.reject(new Error('Error')),
            } as any;

            render(
                <WithRenderProp dataProvider={dataProviderWithAuthorsError} />
            );
            await waitFor(() => {
                expect(screen.queryByText('Error')).not.toBeNull();
            });
        });

        it('should pass the loading state', async () => {
            jest.spyOn(console, 'error')
                .mockImplementationOnce(() => {})
                .mockImplementationOnce(() => {});

            const dataProviderWithAuthorsLoading = {
                getOne: () =>
                    Promise.resolve({
                        data: {
                            id: 1,
                            title: 'War and Peace',
                            author: 1,
                            summary:
                                "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                            year: 1869,
                        },
                    }),
                getMany: _resource => new Promise(() => {}),
            } as any;

            render(
                <WithRenderProp dataProvider={dataProviderWithAuthorsLoading} />
            );
            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeNull();
            });
        });

        it('should render the data', async () => {
            render(<WithRenderProp />);
            await waitFor(() => {
                expect(screen.queryByText('Leo')).not.toBeNull();
            });
        });
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('You are offline, cannot load data');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('Leo');
        fireEvent.click(await screen.findByText('Simulate offline'));
        // Ensure the data is still displayed when going offline after it was loaded
        await screen.findByText('You are offline, the data may be outdated');
        await screen.findByText('Leo');
    });

    it('should not render the empty component for zero-index ids', async () => {
        render(<ZeroIndex />);
        await waitFor(() => {
            expect(screen.queryByText('Leo')).not.toBeNull();
        });
    });
});
