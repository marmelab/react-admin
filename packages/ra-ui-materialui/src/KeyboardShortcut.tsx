import * as React from 'react';
import {
    ComponentsOverrides,
    styled,
    SxProps,
    Typography,
} from '@mui/material';
import clsx from 'clsx';

export const KeyboardShortcut = ({
    className,
    keyboardShortcut,
    ...rest
}: KeyboardShortcutProps) => {
    if (!keyboardShortcut) {
        return null;
    }

    return (
        <Root
            className={clsx(KeyboardShortcutClasses.root, className)}
            {...rest}
        >
            {keyboardShortcut
                .split('>')
                .map((sequence, sequenceIndex, sequences) => (
                    <React.Fragment key={`${sequence}-${sequenceIndex}`}>
                        {sequence.split('+').map((key, keyIndex) => (
                            <React.Fragment key={`${key}-${keyIndex}`}>
                                <Typography
                                    component="kbd"
                                    className={KeyboardShortcutClasses.kbd}
                                    key={key}
                                >
                                    {KeyMap[key]
                                        ? KeyMap[key]
                                        : key.toUpperCase()}
                                </Typography>
                            </React.Fragment>
                        ))}
                        {sequenceIndex < sequences.length - 1 ? (
                            <>&nbsp;</>
                        ) : null}
                    </React.Fragment>
                ))}
        </Root>
    );
};

const KeyMap = {
    meta: '⌘',
    mod: '⌘',
    ctrl: '⌃',
    shift: '⇧',
    alt: '⌥',
    enter: '⏎',
    esc: '⎋',
    escape: '⎋',
    backspace: '⌫',
    delete: '⌦',
    tab: '⇥',
    space: '␣',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    home: '↖',
    end: '↘',
    pageup: '⇞',
    pagedown: '⇟',
};

export interface KeyboardShortcutProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    > {
    keyboardShortcut?: string;
    sx?: SxProps;
}

const PREFIX = 'RaKeyboardShortcut';
const KeyboardShortcutClasses = {
    root: `${PREFIX}-root`,
    kbd: `${PREFIX}-kbd`,
};

const Root = styled('div')(({ theme }) => ({
    opacity: 0.7,
    [`& .${KeyboardShortcutClasses.kbd}`]: {
        padding: '4px 5px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        margin: '0 1px',
        fontSize: '11px',
        lineHeight: '10px',
        color: theme.palette.text.primary,
        verticalAlign: 'middle',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 6,
        boxShadow: `inset 0 -1px 0 ${theme.palette.divider}`,
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root' | 'kbd';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<KeyboardShortcutProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
