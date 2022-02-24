import * as React from 'react';
import { screen, render } from '@testing-library/react';
import { useGetResourceLabel } from './useGetResourceLabel';

import { TestTranslationProvider } from '../i18n';

describe('useGetResourceLabel', () => {
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

            render(
                <TestTranslationProvider messages={{}}>
                    <Component />
                </TestTranslationProvider>
            );

            expect(screen.queryByText(expected)).not.toBeNull();
        }
    );
});
