import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    Errored,
    Loading,
    Offline,
    WithRenderProp,
} from './ReferenceManyFieldBase.stories';

import { ReferenceManyFieldBase } from './ReferenceManyFieldBase';
import { useResourceContext } from '../../core/useResourceContext';
import { testDataProvider } from '../../dataProvider/testDataProvider';
import { CoreAdminContext } from '../../core/CoreAdminContext';
import { onlineManager } from '@tanstack/react-query';

describe('ReferenceManyFieldBase', () => {
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
            getList: () =>
                // @ts-ignore
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceManyFieldBase
                    reference="posts"
                    source="post_id"
                    target="post"
                >
                    <MyComponent />
                </ReferenceManyFieldBase>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('posts')).not.toBeNull();
        });
    });

    it('should render the data', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.queryByText('War and Peace')).not.toBeNull();
            expect(screen.queryByText('Anna Karenina')).not.toBeNull();
            expect(screen.queryByText('The Kreutzer Sonata')).not.toBeNull();
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
                getManyReference: () => Promise.reject(new Error('Error')),
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
                expect(screen.queryByText('War and Peace')).not.toBeNull();
                expect(screen.queryByText('Anna Karenina')).not.toBeNull();
                expect(
                    screen.queryByText('The Kreutzer Sonata')
                ).not.toBeNull();
            });
        });
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline offline={<p>You are offline, cannot load data</p>} />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('You are offline, cannot load data');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('War and Peace');
    });
    it('should allow children to handle the offline state', async () => {
        render(<Offline offline={undefined} />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('AuthorList: Offline. Could not load data');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('War and Peace');
    });
});
