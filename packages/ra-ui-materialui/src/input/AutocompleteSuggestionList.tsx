import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import classnames from 'classnames';
import { Paper, Popper } from '@mui/material';

const PREFIX = 'RaAutocompleteSuggestionList';

const classes = {
    suggestionsContainer: `${PREFIX}-suggestionsContainer`,
    suggestionsPaper: `${PREFIX}-suggestionsPaper`,
};

const StyledPopper = styled(Popper)({
    [`&.${classes.suggestionsContainer}`]: {
        zIndex: 2,
    },
    [`& .${classes.suggestionsPaper}`]: {
        maxHeight: '50vh',
        overflowY: 'auto',
    },
});

interface Props {
    children: ReactNode;
    className?: string;
    isOpen: boolean;
    menuProps: any;
    inputEl: HTMLElement;
    classes?: any;
    suggestionsContainerProps?: any;
}

const PopperModifiers = [];
const AutocompleteSuggestionList = (props: Props) => {
    const {
        children,
        className,
        isOpen,
        menuProps,
        inputEl,
        suggestionsContainerProps,
    } = props;

    return (
        <StyledPopper
            open={isOpen}
            anchorEl={inputEl}
            className={classnames(classes.suggestionsContainer, className)}
            modifiers={PopperModifiers}
            {...suggestionsContainerProps}
        >
            <div {...(isOpen ? menuProps : {})}>
                <Paper
                    square
                    style={{
                        marginTop: 8,
                        minWidth: inputEl ? inputEl.clientWidth : null,
                    }}
                    className={classes.suggestionsPaper}
                >
                    {children}
                </Paper>
            </div>
        </StyledPopper>
    );
};

export default AutocompleteSuggestionList;
