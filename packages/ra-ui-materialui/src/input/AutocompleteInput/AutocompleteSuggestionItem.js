import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { withStyles, createStyles } from '@material-ui/core/styles';

const styles = theme => createStyles({
    suggestion: {
        display: 'block',
        fontFamily: theme.typography.fontFamily,
    },
    suggestionText: { fontWeight: 300 },
    highlightedSuggestionText: { fontWeight: 500 },
});

const AutocompleteSuggestionItem = ({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
    inputValue,
    suggestionComponent,
    classes,
    getSuggestionText,
}) => {
    const isHighlighted = highlightedIndex === index
    const suggestionText = getSuggestionText(suggestion);
    const isSelected = (selectedItem || '').indexOf(suggestionText) > -1;
    const matches = match(suggestionText, inputValue);
    const parts = parse(suggestionText, matches);

    return (
        <MenuItem
            {...itemProps}
            key={suggestionText}
            selected={isHighlighted}
            component={suggestionComponent || 'div'}
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            <div className={classes.suggestion}>
                {
                    parts.map((part, index) => {
                        return part.highlight ? (
                            <span
                                key={index}
                                className={classes.highlightedSuggestionText}
                            >
                                {part.text}
                            </span>
                        ) : (
                            <strong
                                key={index}
                                className={classes.suggestionText}
                            >
                                {part.text}
                            </strong>
                        );
                    })
                }
            </div>
        </MenuItem>
    );
};

export default withStyles(styles)(AutocompleteSuggestionItem);
