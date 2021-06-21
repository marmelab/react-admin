import * as React from 'react';
import { FunctionComponent, isValidElement, cloneElement } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import classnames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            fontWeight: 400,
        },
        selected: {
            fontWeight: 500,
        },
        suggestion: {
            display: 'block',
            fontFamily: theme.typography.fontFamily,
            minHeight: 24,
        },
        suggestionText: { fontWeight: 300 },
        highlightedSuggestionText: { fontWeight: 500 },
    }),
    { name: 'RaAutocompleteSuggestionItem' }
);

export interface AutocompleteSuggestionItemProps {
    createValue?: any;
    suggestion: any;
    index: number;
    highlightedIndex: number;
    isSelected: boolean;
    filterValue: string;
    classes?: any;
    getSuggestionText: (suggestion: any) => string;
}

const AutocompleteSuggestionItem: FunctionComponent<
    AutocompleteSuggestionItemProps & MenuItemProps<'li', { button?: true }>
> = props => {
    const {
        createValue,
        suggestion,
        index,
        highlightedIndex,
        isSelected,
        filterValue,
        classes: classesOverride,
        getSuggestionText,
        ...rest
    } = props;
    const classes = useStyles(props);
    const isHighlighted = highlightedIndex === index;
    const suggestionText =
        'id' in suggestion && suggestion.id === createValue
            ? suggestion.name
            : getSuggestionText(suggestion);
    let matches;
    let parts;

    if (!isValidElement(suggestionText)) {
        matches = match(suggestionText, filterValue);
        parts = parse(suggestionText, matches);
    }

    return (
        <MenuItem
            key={suggestionText}
            selected={isHighlighted}
            className={classnames(classes.root, {
                [classes.selected]: isSelected,
            })}
            {...rest}
        >
            {isValidElement<{ filterValue }>(suggestionText) ? (
                cloneElement<{ filterValue }>(suggestionText, { filterValue })
            ) : (
                <div className={classes.suggestion}>
                    {parts.map((part, index) => {
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
                    })}
                </div>
            )}
        </MenuItem>
    );
};

export default AutocompleteSuggestionItem;
