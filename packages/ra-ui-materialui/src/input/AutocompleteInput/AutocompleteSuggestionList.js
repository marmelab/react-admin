import React from 'react';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles, createStyles } from '@material-ui/core/styles';

import AutocompleteSuggestionItem from './AutocompleteSuggestionItem';

const styles = createStyles({
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
    classes,
    suggestionsContainerProps,
}) => {
    return (
        <Popper
            open={isOpen}
            anchorEl={inputEl}
            className={classes.suggestionsContainer}
            {...suggestionsContainerProps}
        >
            <div {...(isOpen ? menuProps : {})} >
                <Paper
                    square
                    style={{ marginTop: 8, minWidth: inputEl ? inputEl.clientWidth : null }}
                    className={classes.suggestionsPaper}
                >
                    {suggestions.map((suggestion, index) => (
                        <AutocompleteSuggestionItem
                            key={getSuggestionValue(suggestion)}
                            suggestion={suggestion}
                            index={index}
                            itemProps={getItemProps({ item: getSuggestionText(suggestion) })}
                            highlightedIndex={highlightedIndex}
                            selectedItem={selectedItem}
                            inputValue={inputValue}
                            getSuggestionText={getSuggestionText}
                        />
                    ))}
                </Paper>
            </div>
        </Popper>
    );
}

export default withStyles(styles)(AutocompleteSuggestionList);
