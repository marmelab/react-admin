import React, { FunctionComponent } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { makeStyles, MenuItem } from '@material-ui/core';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import classnames from 'classnames';

const useStyles = makeStyles(theme => ({
    root: {
        fontWeight: 400,
    },
    selected: {
        fontWeight: 500,
    },
    suggestion: {
        display: 'block',
        fontFamily: theme.typography.fontFamily,
    },
    suggestionText: { fontWeight: 300 },
    highlightedSuggestionText: { fontWeight: 500 },
}));

interface Props {
    component: any;
    suggestion: any;
    index: number;
    highlightedIndex: number;
    isSelected: boolean;
    inputValue: string;
    classes?: any;
    getSuggestionText: (suggestion: any) => string;
}

const AutocompleteSuggestionItem: FunctionComponent<
    Props & MenuItemProps<'li', { button?: true }>
> = ({
    component,
    suggestion,
    index,
    highlightedIndex,
    isSelected,
    inputValue,
    classes: classesOverride,
    getSuggestionText,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const isHighlighted = highlightedIndex === index;
    const suggestionText = getSuggestionText(suggestion);
    const matches = match(suggestionText, inputValue);
    const parts = parse(suggestionText, matches);

    let additionalPropsForOverrides = {};

    if (!!component) {
        additionalPropsForOverrides = {
            isHighlighted,
            query: inputValue,
            suggestion,
        };
    }
    return (
        <MenuItem
            component={component}
            key={suggestionText}
            selected={isHighlighted}
            className={classnames(classes.root, {
                [classes.selected]: isSelected,
            })}
            // The 3 props defined in additionalPropsForOverrides should only be passed if the component has been overridden
            // as they are unknown to the default base component of MenuItem
            {...additionalPropsForOverrides}
            {...rest}
        >
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
                        <strong key={index} className={classes.suggestionText}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
};

export default AutocompleteSuggestionItem;
