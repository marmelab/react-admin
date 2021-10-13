import * as React from 'react';
import { styled } from '@mui/material/styles';
import { isValidElement, cloneElement } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { MenuItem } from '@mui/material';
import { MenuItemProps } from '@mui/material/MenuItem';
import classnames from 'classnames';

export const AutocompleteSuggestionItem = (
    props: AutocompleteSuggestionItemProps &
        MenuItemProps<'li', { button?: true }>
) => {
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
        <StyledMenuItem
            key={suggestionText}
            selected={isHighlighted}
            className={classnames(AutocompleteSuggestionItemClasses.root, {
                [AutocompleteSuggestionItemClasses.selected]: isSelected,
            })}
            {...rest}
        >
            {isValidElement<{ filterValue }>(suggestionText) ? (
                cloneElement<{ filterValue }>(suggestionText, { filterValue })
            ) : (
                <div className={AutocompleteSuggestionItemClasses.suggestion}>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span
                                key={index}
                                className={
                                    AutocompleteSuggestionItemClasses.highlightedSuggestionText
                                }
                            >
                                {part.text}
                            </span>
                        ) : (
                            <strong
                                key={index}
                                className={
                                    AutocompleteSuggestionItemClasses.suggestionText
                                }
                            >
                                {part.text}
                            </strong>
                        );
                    })}
                </div>
            )}
        </StyledMenuItem>
    );
};

const PREFIX = 'RaAutocompleteSuggestionItem';

const AutocompleteSuggestionItemClasses = {
    root: `${PREFIX}-root`,
    selected: `${PREFIX}-selected`,
    suggestion: `${PREFIX}-suggestion`,
    suggestionText: `${PREFIX}-suggestionText`,
    highlightedSuggestionText: `${PREFIX}-highlightedSuggestionText`,
};

const StyledMenuItem = styled(MenuItem, { name: PREFIX })(({ theme }) => ({
    [`&.${AutocompleteSuggestionItemClasses.root}`]: {
        fontWeight: 400,
    },

    [`&.${AutocompleteSuggestionItemClasses.selected}`]: {
        fontWeight: 500,
    },

    [`& .${AutocompleteSuggestionItemClasses.suggestion}`]: {
        display: 'block',
        fontFamily: theme.typography.fontFamily,
        minHeight: 24,
    },

    [`& .${AutocompleteSuggestionItemClasses.suggestionText}`]: {
        fontWeight: 300,
    },
    [`& .${AutocompleteSuggestionItemClasses.highlightedSuggestionText}`]: {
        fontWeight: 500,
    },
}));

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
