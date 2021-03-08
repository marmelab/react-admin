import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { useResourceLabel } from './useResourceLabel';
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
                const label = useResourceLabel('posts', pluralized);

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
