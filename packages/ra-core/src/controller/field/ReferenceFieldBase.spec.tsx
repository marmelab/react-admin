import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext } from '../../core/CoreAdminContext';
import { useResourceContext } from '../../core/useResourceContext';
import { testDataProvider } from '../../dataProvider';
import { ReferenceFieldBase } from './ReferenceFieldBase';
import { Error, Loading, Meta } from './ReferenceFieldBase.stories';

describe('<ReferenceFieldBase />', () => {
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

        render(<Error />);
        await waitFor(() => {
            expect(screen.queryByText('Error')).not.toBeNull();
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
            // @ts-ignore
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceFieldBase {...defaultProps}>
                    <MyComponent />
                </ReferenceFieldBase>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('posts')).not.toBeNull();
        });
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
});
