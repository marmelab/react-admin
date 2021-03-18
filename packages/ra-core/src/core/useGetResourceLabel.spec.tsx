import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { useGetResourceLabel } from './useGetResourceLabel';
import { TestTranslationProvider } from '../i18n';

describe('useResourceLabel', () => {
    test.each([
        [2, 'Posts'],
        [1, 'Post'],
        [0, 'Post'],
    ])(
        'should infer the %s and %s version of the resource name',
        (count, expected) => {
            const Component = () => {
                const getResourceLabel = useGetResourceLabel();
                const label = getResourceLabel('posts', count);

                return <p>{label}</p>;
            };

            const { queryByText } = renderWithRedux(
                <TestTranslationProvider messages={{}}>
                    <Component />
                </TestTranslationProvider>,
                {
                    admin: {
                        resources: {
                            posts: {
                                props: {
                                    name: 'posts',
                                },
                            },
                        },
                    },
                }
            );

            expect(queryByText(expected)).not.toBeNull();
        }
    );
});
