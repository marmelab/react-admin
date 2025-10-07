import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    Loading,
    Offline,
    WithRenderProp,
} from './ReferenceOneFieldBase.stories';
import { onlineManager } from '@tanstack/react-query';

describe('ReferenceOneFieldBase', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
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

    it('should render the data', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.queryByText('9780393966473')).not.toBeNull();
        });
    });

    describe('with render prop', () => {
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
                expect(screen.queryByText('9780393966473')).not.toBeNull();
            });
        });
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('You are offline, cannot load data');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('9780393966473');
        fireEvent.click(await screen.findByText('Simulate offline'));
        // Ensure the data is still displayed when going offline after it was loaded
        await screen.findByText('You are offline, the data may be outdated');
        await screen.findByText('9780393966473');
    });
});
