import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import classnames from 'classnames';
import { Paper, Popper } from '@mui/material';

export const AutocompleteSuggestionList = (
    props: AutocompleteSuggestionListProps
) => {
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
            className={classnames(
                AutocompleteSuggestionListClasses.suggestionsContainer,
                className
            )}
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
                    className={
                        AutocompleteSuggestionListClasses.suggestionsPaper
                    }
                >
                    {children}
                </Paper>
            </div>
        </StyledPopper>
    );
};

const PREFIX = 'RaAutocompleteSuggestionList';

export const AutocompleteSuggestionListClasses = {
    suggestionsContainer: `${PREFIX}-suggestionsContainer`,
    suggestionsPaper: `${PREFIX}-suggestionsPaper`,
};

const StyledPopper = styled(Popper, { name: PREFIX })({
    [`&.${AutocompleteSuggestionListClasses.suggestionsContainer}`]: {
        zIndex: 2,
    },
    [`& .${AutocompleteSuggestionListClasses.suggestionsPaper}`]: {
        maxHeight: '50vh',
        overflowY: 'auto',
    },
});

export interface AutocompleteSuggestionListProps {
    children: ReactNode;
    className?: string;
    isOpen: boolean;
    menuProps: any;
    inputEl: HTMLElement;
    classes?: any;
    suggestionsContainerProps?: any;
}

const PopperModifiers = [];
