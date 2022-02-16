import * as React from 'react';
import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { RichTextInputLevelSelect } from './RichTextInputLevelSelect';
import {
    AlignmentButtons,
    FormatButtons,
    ListButtons,
    LinkButtons,
    QuoteButtons,
    ClearButtons,
} from './buttons';

/**
 * A toolbar for the <RichTextInput>.
 * @param props The toolbar props.
 * @param {ReactNode} props.children The toolbar children, usually many <ToggleButton>.
 * @param {'small' | 'medium' | 'large'} props.size The default size to apply to the **default** children.
 *
 * @example <caption>Customizing the size</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = (props) => (
 *     <RichTextInput
 *         toolbar={<RichTextInputToolbar size="large" />}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 *
 * @example <caption>Customizing the children</caption>
 * import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';
 * const MyRichTextInput = ({ size, ...props }) => (
 *     <RichTextInput
 *         toolbar={(
 *             <RichTextInputToolbar>
 *                 <RichTextInputLevelSelect size={size} />
 *                 <FormatButtons size={size} />
 *                 <ListButtons size={size} />
 *                 <LinkButtons size={size} />
 *                 <QuoteButtons size={size} />
 *                 <ClearButtons size={size} />
 *             </RichTextInputToolbar>
 *         )}
 *         label="Body"
 *         source="body"
 *         {...props}
 *     />
 * );
 */
export const RichTextInputToolbar = (props: RichTextInputToolbarProps) => {
    const {
        size = 'medium',
        children = (
            <>
                <RichTextInputLevelSelect size={size} />
                <FormatButtons size={size} />
                <AlignmentButtons size={size} />
                <ListButtons size={size} />
                <LinkButtons size={size} />
                <QuoteButtons size={size} />
                <ClearButtons size={size} />
            </>
        ),
        ...rest
    } = props;

    return (
        <Root className={classes.root} {...rest}>
            {children}
        </Root>
    );
};

const PREFIX = 'RaRichTextInputToolbar';
const classes = {
    root: `${PREFIX}-root`,
};
const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        marginBottom: theme.spacing(1),
        alignItems: 'center',
        '& > *': {
            marginRight: theme.spacing(1),
        },
        '& > *:last-child': {
            marginRight: 0,
        },
    },
}));

export type RichTextInputToolbarProps = {
    children?: ReactNode;
    size?: 'small' | 'medium' | 'large';
};
