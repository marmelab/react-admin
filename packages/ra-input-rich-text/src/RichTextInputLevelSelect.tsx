import * as React from 'react';
import { useState } from 'react';
import { List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Editor } from '@tiptap/react';
import { useTranslate } from 'ra-core';
import clsx from 'clsx';
import { useTiptapEditor } from './useTiptapEditor';

export const RichTextInputLevelSelect = (
    props: RichTextInputLevelSelectProps
) => {
    const translate = useTranslate();
    const editor = useTiptapEditor();
    const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
        null
    );
    const { size } = props;

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number
    ) => {
        setAnchorElement(null);
        const selectedItem = options[index];
        if (selectedItem.value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else if (selectedItem.value === 'heading') {
            editor
                .chain()
                .focus()
                .setHeading({ level: selectedItem.level })
                .run();
        }
    };

    const handleClickListItem = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        setAnchorElement(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        setAnchorElement(null);
    };

    const selectedOption =
        options.find(option => isSelectedOption(editor, option)) || options[0];

    return (
        <Root>
            <List
                component="nav"
                aria-label={translate('ra.tiptap.select_level', {
                    _: 'Select the level',
                })}
                dense
                disablePadding
                className={classes.list}
            >
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="level-menu"
                    aria-label={translate('ra.tiptap.current_level', {
                        _: 'Current level',
                    })}
                    onClick={handleClickListItem}
                    className={clsx({
                        [classes.sizeSmall]: size === 'small',
                        [classes.sizeLarge]: size === 'large',
                    })}
                >
                    <ListItemText
                        primary={translate(selectedOption.label, {
                            _: selectedOption.defaultLabel,
                        })}
                    />
                    <ArrowDropDownIcon />
                </ListItem>
            </List>
            <Menu
                anchorEl={anchorElement}
                open={Boolean(anchorElement)}
                id="level-menu"
                onClose={handleClose}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option.label}
                        selected={option === selectedOption}
                        onClick={event => {
                            handleMenuItemClick(event, index);
                        }}
                    >
                        {translate(option.label, { _: option.defaultLabel })}
                    </MenuItem>
                ))}
            </Menu>
        </Root>
    );
};

type LevelOption = ParagraphLevelOption | HeadingLevelOption;

type ParagraphLevelOption = {
    label: string;
    defaultLabel: string;
    value: 'paragraph';
};

type HeadingLevelOption = {
    label: string;
    defaultLabel: string;
    value: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
};

const options: Array<LevelOption | HeadingLevelOption> = [
    {
        label: 'ra.tiptap.paragraph',
        defaultLabel: 'Normal',
        value: 'paragraph',
    },
    {
        label: 'ra.tiptap.heading1',
        defaultLabel: 'Heading 1',
        value: 'heading',
        level: 1,
    },
    {
        label: 'ra.tiptap.heading2',
        defaultLabel: 'Heading 2',
        value: 'heading',
        level: 2,
    },
    {
        label: 'ra.tiptap.heading3',
        defaultLabel: 'Heading 3',
        value: 'heading',
        level: 3,
    },
    {
        label: 'ra.tiptap.heading4',
        defaultLabel: 'Heading 4',
        value: 'heading',
        level: 4,
    },
    {
        label: 'ra.tiptap.heading5',
        defaultLabel: 'Heading 5',
        value: 'heading',
        level: 5,
    },
    {
        label: 'ra.tiptap.heading6',
        defaultLabel: 'Heading 6',
        value: 'heading',
        level: 6,
    },
];

const isSelectedOption = (editor: Editor, option: LevelOption): boolean => {
    if (!editor) {
        return false;
    }

    if (option.value === 'paragraph') {
        return editor.isActive('paragraph');
    }

    return editor.isActive('heading', { level: option.level });
};

const PREFIX = 'RaRichTextInputLevelSelect';
const classes = {
    list: `${PREFIX}-list`,
    sizeSmall: `${PREFIX}-sizeSmall`,
    sizeLarge: `${PREFIX}-sizeLarge`,
};
const Root = styled('div')(({ theme }) => ({
    [`&.${classes.list}`]: {
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${alpha(theme.palette.action.active, 0.12)}`,
    },
    [`& .${classes.sizeSmall}`]: {
        paddingTop: 1,
        paddingBottom: 1,
        '& .MuiTypography-root': {
            fontSize: theme.typography.pxToRem(13),
        },
    },
    [`& .${classes.sizeLarge}`]: {
        paddingTop: 8,
        paddingBottom: 8,
        '& .MuiTypography-root': {
            fontSize: theme.typography.pxToRem(15),
        },
    },
}));

export type RichTextInputLevelSelectProps = {
    size?: 'small' | 'medium' | 'large';
};
