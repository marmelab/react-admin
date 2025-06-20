import React from 'react';
import { deepmerge } from '@mui/utils';
import { ThemeOptions } from '@mui/material';

import { defaultLightTheme } from '../theme';
import { CloneButton } from './CloneButton';
import { AdminContext } from '../AdminContext';

export default { title: 'ra-ui-materialui/button/CloneButton' };

const Wrapper = ({ children, ...props }) => {
    return <AdminContext {...props}>{children}</AdminContext>;
};

export const Basic = () => {
    return (
        <Wrapper>
            <CloneButton resource="posts" record={{ id: 123, foo: 'bar' }} />
        </Wrapper>
    );
};

export const Themed = () => {
    return (
        <Wrapper
            theme={deepmerge(defaultLightTheme, {
                components: {
                    RaCloneButton: {
                        defaultProps: {
                            label: 'Clone',
                            className: 'custom-class',
                            'data-testid': 'themed',
                        },
                    },
                },
            } as ThemeOptions)}
        >
            <CloneButton resource="posts" record={{ id: 123, foo: 'bar' }} />
        </Wrapper>
    );
};
