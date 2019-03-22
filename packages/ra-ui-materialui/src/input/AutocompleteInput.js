import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, createStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import compose from 'recompose/compose';
import Downshift from 'downshift';

import { addField, translate as withTranslate, FieldTitle } from 'ra-core';

const styles = theme =>
    createStyles({
        container: {
            flexGrow: 1,
            position: 'relative',
        },
        root: {},
        suggestionsContainerOpen: {
            position: 'absolute',
            marginBottom: theme.spacing(3),
            zIndex: 2,
        },
        suggestionsPaper: {
            maxHeight: '50vh',
            overflowY: 'auto',
        },
        suggestion: {
            display: 'block',
            fontFamily: theme.typography.fontFamily,
        },
        suggestionText: { fontWeight: 300 },
        highlightedSuggestionText: { fontWeight: 500 },
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
export class AutocompleteInput extends React.Component {
    inputEl = null;

    getSuggestionValue = suggestion => get(suggestion, this.props.optionValue);

    getSuggestionText = suggestion => {
        if (!suggestion) return '';

        const { optionText, translate, translateChoice } = this.props;
        const suggestionLabel =
            typeof optionText === 'function'
                ? optionText(suggestion)
                : get(suggestion, optionText, '');

        // We explicitly call toString here because AutoSuggest expect a string
        return translateChoice
            ? translate(suggestionLabel, { _: suggestionLabel }).toString()
            : suggestionLabel.toString();
    };

    getSuggestionTextFromValue = value => {
        const { choices } = this.props;
        const currentChoice = choices.find(
            choice => this.getSuggestionValue(choice) === value
        );

        return this.getSuggestionText(currentChoice);
    };

    handleSuggestionSelected = suggestionText => {
        const { choices } = this.props;
        const suggestion = choices.find(
            suggestion => this.getSuggestionText(suggestion) === suggestionText
        );
        const { input } = this.props;

        const inputValue = this.getSuggestionValue(suggestion);
        if (input && input.onChange) {
            this.setState(
                {
                    dirty: false,
                    inputValue,
                    selectedItem: suggestion,
                },
                () => {
                    input.onChange(inputValue);
                }
            );
        }
    };

    updateFilter = value => {
        const { setFilter } = this.props;
        setFilter(value);
    };

    updateAnchorEl() {
        if (!this.inputEl) {
            return;
        }

        const inputPosition = this.inputEl.getBoundingClientRect();

        if (!this.anchorEl) {
            this.anchorEl = { getBoundingClientRect: () => inputPosition };
        } else {
            const anchorPosition = this.anchorEl.getBoundingClientRect();

            if (
                anchorPosition.x !== inputPosition.x ||
                anchorPosition.y !== inputPosition.y
            ) {
                this.anchorEl = { getBoundingClientRect: () => inputPosition };
            }
        }
    }

    getSuggestions = filter => {
        const { choices, allowEmpty, optionText, optionValue } = this.props;

        const filteredChoices = choices.filter(choice =>
            choice[optionText].match(new RegExp(filter, 'i'))
        );

        if (allowEmpty) {
            const emptySuggestion = {
                [optionText]: '',
                [optionValue]: null,
            };

            return filteredChoices.concat(emptySuggestion);
        }

        return filteredChoices;
    };

    render() {
        const { classes = {}, input } = this.props;
        const storeInputRef = input => {
            this.inputEl = input;
            this.updateAnchorEl();
        };

        return (
            <Downshift
                id="downshift-popper"
                onChange={this.handleSuggestionSelected}
                initialInputValue={this.getSuggestionTextFromValue(input.value)}
            >
                {({
                    getInputProps,
                    getItemProps,
                    getMenuProps,
                    highlightedIndex,
                    isOpen,
                    inputValue,
                    selectedItem,
                    openMenu,
                    ...rest
                }) => {
                    return (
                        <div className={classes.container}>
                            {this.renderInput({
                                fullWidth: true,
                                classes,
                                InputProps: getInputProps({
                                    onFocus: openMenu,
                                }),
                                ref: storeInputRef,
                            })}
                            {/* // @TODO replace div with Popper and makes it work */}
                            {isOpen ? (
                                <div open={isOpen} anchorEl={this.inputEl}>
                                    <div {...(isOpen ? getMenuProps({}) : {})}>
                                        <Paper
                                            square
                                            style={{
                                                marginTop: 8,
                                                width: this.inputEl
                                                    ? this.inputEl.clientWidth
                                                    : null,
                                            }}
                                        >
                                            {this.getSuggestions(
                                                inputValue
                                            ).map((suggestion, index) =>
                                                this.renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({
                                                        item: this.getSuggestionText(
                                                            suggestion
                                                        ),
                                                    }),
                                                    highlightedIndex,
                                                    selectedItem,
                                                    inputValue,
                                                })
                                            )}
                                        </Paper>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    );
                }}
            </Downshift>
        );
    }

    renderInput = inputProps => {
        const { InputProps, classes, ref, label, ...otherProps } = inputProps;
        const { source, resource, isRequired, translate } = this.props;
        return (
            <TextField
                label={
                    <FieldTitle
                        label={translate(label)}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
<<<<<<< HEAD
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                margin={margin}
                variant={variant}
                className={classnames(classes.root, className)}
                inputRef={storeInputRef}
                error={!!(touched && error)}
                helperText={
                    (touched && error) || helperText ? (
                        <InputHelperText
                            touched={touched}
                            error={error}
                            helperText={helperText}
                        />
                    ) : null
                }
                name={input.name}
                {...options}
||||||| merged common ancestors
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                margin="normal"
                className={classnames(classes.root, className)}
                inputRef={storeInputRef}
                error={!!(touched && error)}
                helperText={
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                }
                name={input.name}
                {...options}
=======
>>>>>>> refactor replacing autosuggest by Downshift
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    },
                    ...InputProps,
                    onChange: event => {
                        InputProps.onChange(event);
                        this.updateFilter(event.target.value);
                    },
                }}
                {...otherProps}
            />
        );
    };

    renderSuggestion = ({
        suggestion,
        index,
        itemProps,
        highlightedIndex,
        selectedItem,
        inputValue,
    }) => {
        const { classes } = this.props;
        const isHighlighted = highlightedIndex === index;
        const suggestionText = this.getSuggestionText(suggestion);
        const isSelected = (selectedItem || '').indexOf(suggestionText) > -1;
        const matches = match(suggestionText, inputValue);
        const parts = parse(suggestionText, matches);

        return (
            <MenuItem
                {...itemProps}
                key={suggestionText}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                <div>
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
            </MenuItem>
        );
    };
}

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
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

AutocompleteInput.defaultProps = {
    choices: [],
    focusInputOnSuggestionClick: false,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    limitChoicesToValue: false,
    translateChoice: true,
};

export default compose(
    addField,
    withTranslate,
    withStyles(styles)
)(AutocompleteInput);
