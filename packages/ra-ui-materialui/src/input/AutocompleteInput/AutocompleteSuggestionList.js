import React from 'react';
import { makeStyles, Paper, Popper } from '@material-ui/core';

import AutocompleteSuggestionItem from './AutocompleteSuggestionItem';

const useStyles = makeStyles({
    suggestionsContainer: {
        zIndex: 2,
    },
    suggestionsPaper: {
        maxHeight: '50vh',
        overflowY: 'auto',
    },
});

const AutocompleteSuggestionList = ({
    isOpen,
    menuProps,
    inputEl,
    suggestions,
    getSuggestionText,
    getSuggestionValue,
    selectedItem,
    inputValue,
    getItemProps,
    highlightedIndex,
    classes: classesOverride,
    suggestionComponent,
    suggestionsContainerProps,
}) => {
    const classes = useStyles({ classes: classesOverride });

    return (
        <Popper
            open={isOpen}
            anchorEl={inputEl}
            className={classes.suggestionsContainer}
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
                    {suggestions.map((suggestion, index) => (
                        <AutocompleteSuggestionItem
                            key={getSuggestionValue(suggestion)}
                            suggestion={suggestion}
                            index={index}
                            highlightedIndex={highlightedIndex}
                            selectedItem={selectedItem}
                            inputValue={inputValue}
                            getSuggestionText={getSuggestionText}
                            component={suggestionComponent}
                            {...getItemProps({
                                item: getSuggestionText(suggestion),
                            })}
                        />
                    ))}
                </Paper>
            </div>
        </Popper>
    );
};

export default AutocompleteSuggestionList;
