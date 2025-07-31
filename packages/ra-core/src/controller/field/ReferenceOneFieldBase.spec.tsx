import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    Loading,
    WithRenderProp,
} from './ReferenceOneFieldBase.stories';

describe('ReferenceOneFieldBase', () => {
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
});
