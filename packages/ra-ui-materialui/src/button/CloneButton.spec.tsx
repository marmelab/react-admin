import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { AdminContext } from '../AdminContext';
import { CloneButton } from './CloneButton';
import { deepmerge } from '@mui/utils';
import { defaultLightTheme } from '../theme';
import { ThemeOptions } from '@mui/material';

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    resource: 'posts',
};

describe('<CloneButton />', () => {
    it('should pass a clone of the record in the location state', () => {
        render(
            <AdminContext>
                <CloneButton
                    resource="posts"
                    record={{ id: 123, foo: 'bar' }}
                />
            </AdminContext>
        );

        expect(
            screen.getByLabelText('ra.action.clone').getAttribute('href')
        ).toEqual('#/posts/create?source=%7B%22foo%22%3A%22bar%22%7D');
    });

    it('should render as button type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <AdminContext>
                <CloneButton {...invalidButtonDomProps} />
            </AdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(
            screen.getByLabelText('ra.action.clone').getAttribute('href')
        ).toEqual('#/posts/create?source=%7B%22foo%22%3A%22bar%22%7D');

        spy.mockRestore();
    });

    it('should be customized by a theme', () => {
        render(
            <AdminContext
                theme={deepmerge(defaultLightTheme, {
                    components: {
                        RaCloneButton: {
                            defaultProps: {
                                label: 'Clone',
                                className: 'custom-class',
                                'data-testid': 'themed-button',
                            },
                        },
                    },
                } as ThemeOptions)}
            >
                <CloneButton
                    resource="posts"
                    record={{ id: 123, foo: 'bar' }}
                />
            </AdminContext>
        );

        const button = screen.getByTestId('themed-button');
        expect(button.textContent).toBe('Clone');
        expect(button.classList).toContain('custom-class');
    });
});
