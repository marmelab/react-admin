import * as React from 'react';
import { ReactNode, FunctionComponent } from 'react';
import { makeStyles, Paper, Popper } from '@material-ui/core';

const useStyles = makeStyles(
    {
        suggestionsContainer: {
            zIndex: 2,
        },
        suggestionsPaper: {
            maxHeight: '50vh',
            overflowY: 'auto',
        },
    },
    { name: 'RaAutocompleteSuggestionList' }
);

interface Props {
    children: ReactNode;
    isOpen: boolean;
    menuProps: any;
    inputEl: HTMLElement;
    classes?: any;
    suggestionsContainerProps?: any;
}

const AutocompleteSuggestionList: FunctionComponent<Props> = props => {
    const {
        children,
        isOpen,
        menuProps,
        inputEl,
        suggestionsContainerProps,
    } = props;
    const classes = useStyles(props);

    return (
        <Popper
            open={isOpen}
            anchorEl={inputEl}
            className={classes.suggestionsContainer}
            modifiers={{}}
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
        </Popper>
    );
};

export default AutocompleteSuggestionList;
