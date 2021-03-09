import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { useGetResourceLabel } from './useGetResourceLabel';
import { TestTranslationProvider } from '../i18n';

describe('useResourceLabel', () => {
    test.each([
        ['pluralized', 'Posts'],
        ['singularized', 'Post'],
    ])(
        'should infer the %s and %s version of the resource name',
        (pluralization, expected) => {
            const Component = () => {
                const pluralized = pluralization === 'pluralized';
                const getResourceLabel = useGetResourceLabel();
                const label = getResourceLabel('posts', pluralized);

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
