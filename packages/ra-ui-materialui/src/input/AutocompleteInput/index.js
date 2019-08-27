import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import Downshift from 'downshift';
import { useTranslate, useInput } from 'ra-core';

import AutocompleteInputTextField from './AutocompleteInputTextField';
import AutocompleteSuggestionList from './AutocompleteSuggestionList';
import getSuggestions from './getSuggestions';
import { InputHelperText } from '..';

const useStyles = makeStyles({
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    root: {},
    suggestionsContainer: {
        zIndex: 2,
    },
    suggestionsPaper: {
        maxHeight: '50vh',
        overflowY: 'auto',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
});

/**
 * An Input component for an autocomplete field, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <AutocompleteInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <AutocompleteInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <AutoComplete> component
 *
 * @example
 * <AutocompleteInput source="author_id" options={{ fullWidth: true }} />
 */
const AutocompleteInput = ({
    classes: classesOverride,
    allowEmpty,
    choices,
    fullWidth,
    helperText,
    label,
    limitChoicesToValue,
    onBlur,
    onChange,
    onFocus,
    options,
    optionText,
    optionValue,
    resource,
    setFilter,
    shouldRenderSuggestions: shouldRenderSuggestionsOverride,
    source,
    suggestionComponent,
    translateChoice,
    validate,
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles({ classes: classesOverride });
    const {
        id,
        input,
        isRequired,
        meta: { touched, error },
    } = useInput({
        onBlur,
        onChange,
        onFocus,
        resource,
        source,
        type: 'checkbox',
        validate,
        ...rest,
    });

    let inputEl = useRef();
    let anchorEl = useRef();

    const updateFilter = useCallback(
        value => {
            if (setFilter) {
                setFilter(value);
            }
        },
        [setFilter]
    );

    useEffect(() => {
        updateFilter('');
    }, [input.value, updateFilter]);

    const getSuggestionValue = suggestion => get(suggestion, optionValue);

    const getSuggestionText = suggestion => {
        if (!suggestion) return '';

        const suggestionLabel =
            typeof optionText === 'function'
                ? optionText(suggestion)
                : get(suggestion, optionText, '');

        // We explicitly call toString here because AutoSuggest expect a string
        return translateChoice
            ? translate(suggestionLabel, { _: suggestionLabel }).toString()
            : suggestionLabel.toString();
    };

    const getSuggestionTextFromValue = value => {
        const currentChoice = choices.find(
            choice => getSuggestionValue(choice) === value
        );

        return getSuggestionText(currentChoice);
    };

    const handleSuggestionSelected = suggestionText => {
        const possibleSuggestions = getSuggestions({
            choices,
            allowEmpty,
            optionText,
            optionValue,
            limitChoicesToValue,
            getSuggestionText,
        })(suggestionText);

        const suggestion = possibleSuggestions.find(
            suggestion => getSuggestionText(suggestion) === suggestionText
        );

        const value = getSuggestionValue(suggestion);
        input.onChange(value);
    };

    const updateAnchorEl = () => {
        if (!inputEl.current) {
            return;
        }

        const inputPosition = inputEl.current.getBoundingClientRect();

        if (!anchorEl.current) {
            anchorEl.current = { getBoundingClientRect: () => inputPosition };
        } else {
            const anchorPosition = anchorEl.current.getBoundingClientRect();

            if (
                anchorPosition.x !== inputPosition.x ||
                anchorPosition.y !== inputPosition.y
            ) {
                anchorEl.current = {
                    getBoundingClientRect: () => inputPosition,
                };
            }
        }
    };

    const shouldRenderSuggestions = val => {
        if (
            shouldRenderSuggestionsOverride !== undefined &&
            typeof shouldRenderSuggestionsOverride === 'function'
        ) {
            return shouldRenderSuggestionsOverride(val);
        }

        return true;
    };

    const storeInputRef = input => {
        inputEl.current = input;
        updateAnchorEl();
    };

    // Override the blur event handling to automatically select
    // the only choice available if any
    const handleBlur = (suggestionFilter, selectItem) => event => {
        const possibleSuggestions = getSuggestions({
            choices,
            allowEmpty,
            optionText,
            optionValue,
            limitChoicesToValue,
            getSuggestionText,
        })(suggestionFilter);

        let suggestionToSelect;

        if (possibleSuggestions.length === 2 && allowEmpty) {
            if (input.value === null) {
                return input.onBlur(event);
            }

            if (suggestionFilter === '') {
                suggestionToSelect = possibleSuggestions.find(
                    suggestion => suggestion.id === null
                );
            } else {
                suggestionToSelect = possibleSuggestions.find(
                    suggestion => suggestion.id !== null
                );
            }
        }

        if (possibleSuggestions.length === 1) {
            suggestionToSelect = possibleSuggestions.find(
                suggestion => suggestion.id !== null
            );
        }

        if (suggestionToSelect) {
            const value = getSuggestionValue(suggestionToSelect);
            if (input.value === value) {
                return input.onBlur(event);
            }

            const text = getSuggestionText(suggestionToSelect);

            selectItem(text);
        } else {
            const text = getSuggestionTextFromValue(input.value);
            selectItem(text);
        }

        return input.onBlur(event);
    };

    const handleFocus = openMenu => event => {
        openMenu(event);
        input.onFocus(event);
    };

    return (
        <Downshift
            id={id}
            onChange={handleSuggestionSelected}
            initialInputValue={getSuggestionTextFromValue(input.value)}
            {...rest}
        >
            {({
                getInputProps,
                getLabelProps,
                getItemProps,
                getMenuProps,
                highlightedIndex,
                isOpen,
                inputValue,
                selectItem,
                selectedItem,
                openMenu,
            }) => {
                const isMenuOpen = isOpen && shouldRenderSuggestions();
                return (
                    <div className={classes.container}>
                        <AutocompleteInputTextField
                            id={id}
                            fullWidth={fullWidth}
                            labelProps={getLabelProps({ label })}
                            InputProps={getInputProps({
                                id,
                                name: input.name,
                                onBlur: handleBlur(inputValue, selectItem),
                                onFocus: handleFocus(openMenu),
                            })}
                            inputRef={storeInputRef}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                            handleChange={updateFilter}
                            helperText={
                                <InputHelperText
                                    touched={touched}
                                    error={error}
                                    helperText={helperText}
                                />
                            }
                            error={!!(touched && error)}
                        />
                        <AutocompleteSuggestionList
                            isOpen={isMenuOpen}
                            menuProps={getMenuProps(
                                {},
                                { suppressRefError: true }
                            )}
                            inputEl={inputEl.current}
                            suggestions={getSuggestions({
                                choices,
                                allowEmpty,
                                optionText,
                                optionValue,
                                limitChoicesToValue,
                                getSuggestionText,
                            })(inputValue)}
                            getSuggestionText={getSuggestionText}
                            getSuggestionValue={getSuggestionValue}
                            highlightedIndex={highlightedIndex}
                            inputValue={inputValue}
                            getItemProps={getItemProps}
                            suggestionComponent={suggestionComponent}
                            suggestionsContainerProps={
                                options.suggestionsContainerProps
                            }
                            selectedItem={selectedItem}
                        />
                    </div>
                );
            }}
        </Downshift>
    );
};

AutocompleteInput.propTypes = {
    allowEmpty: PropTypes.bool,
    alwaysRenderSuggestions: PropTypes.bool, // used only for unit tests
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    focusInputOnSuggestionClick: PropTypes.bool,
    InputProps: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    limitChoicesToValue: PropTypes.bool,
    meta: PropTypes.object,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    setFilter: PropTypes.func,
    shouldRenderSuggestions: PropTypes.func,
    source: PropTypes.string,
    suggestionComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    translateChoice: PropTypes.bool.isRequired,
};

AutocompleteInput.defaultProps = {
    choices: [],
    focusInputOnSuggestionClick: false,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    limitChoicesToValue: true,
    translateChoice: true,
};

export default AutocompleteInput;
