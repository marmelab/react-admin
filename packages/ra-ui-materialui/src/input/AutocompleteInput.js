import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, createStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { addField, translate, FieldTitle } from 'ra-core';
import InputHelperText from './InputHelperText';

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

const DefaultSuggestionComponent = React.forwardRef(
    ({ suggestion, query, isHighlighted, ...props }, ref) => (
        <div {...props} ref={ref} />
    )
);

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
    state = {
        searching: false,
        searchText: '',
        suggestions: [],
        selectedItem: null,
    };

    ignoreNextChoicesUpdate = false;
    inputEl = null;

    static getDerivedStateFromProps(props, state) {
        const { choices, input, optionValue, optionText, allowEmpty } = props;
        const selectedItem = choices.find(
            choice => choice[optionValue] === input.value
        );
        const emptySuggestion = {
            [optionValue]: null,
            [optionText]: '',
        };
        const suggestions = allowEmpty
            ? props.choices.concat(emptySuggestion)
            : props.choices;
        if (state.searching) {
            return {
                ...state,
                selectedItem,
                suggestions,
            };
        }

        return {
            ...state,
            searchText:
                typeof optionText === 'function'
                    ? optionText(selectedItem)
                    : get(selectedItem, optionText, ''),
            selectedItem,
            suggestions: selectedItem
                ? allowEmpty
                    ? [selectedItem, emptySuggestion]
                    : [selectedItem]
                : suggestions,
        };
    }

    componentDidMount() {
        const { optionText } = this.props;
        const { selectedItem } = this.state;
        if (selectedItem) {
            this.updateFilter(selectedItem[optionText]);
            this.setState({
                suggestions: [selectedItem],
                searchText: selectedItem[optionText],
            });
        }
    }

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

    handleSuggestionSelected = (event, { suggestion, method }) => {
        const { input } = this.props;

        const inputValue = this.getSuggestionValue(suggestion);
        this.setState({
            searchText: suggestion.name,
            searching: false,
        });
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

        if (method === 'enter') {
            event.preventDefault();
        }
    };

    handleSuggestionsFetchRequested = ({ value }) => {
        this.updateFilter(value);
    };

    updateFilter = value => {
        const { setFilter } = this.props;
        setFilter(value);
    };

    handleSuggestionsClearRequested = () => {
        this.setState({ suggestions: [], searching: false });
    };

    handleChangeFilter = (event, { newValue, method }) => {
        if (['type', 'click', 'escape'].includes(method)) {
            this.setState({ searchText: newValue, dirty: true });
        }
    };

    renderInput = inputProps => {
        const {
            helperText,
            input,
            variant = 'filled',
            margin = 'dense',
        } = this.props;
        const {
            autoFocus,
            className,
            classes = {},
            isRequired,
            label,
            meta,
            onChange,
            resource,
            source,
            value,
            ref,
            options: { InputProps, suggestionsContainerProps, ...options },
            ...other
        } = inputProps;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The TextInput component wasn't called within a react-final-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }

        const { touched, error } = meta;

        // We need to store the input reference for our Popper element containg the suggestions
        // but Autosuggest also needs this reference (it provides the ref prop)
        const storeInputRef = input => {
            this.inputEl = input;
            ref(input);
        };

        return (
            <TextField
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
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
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                    ...InputProps,
                    ...other,
                }}
            />
        );
    };

    renderSuggestionsContainer = autosuggestOptions => {
        const {
            containerProps: { className, ...containerProps },
            children,
        } = autosuggestOptions;
        const { classes = {}, options } = this.props;

        return (
            <Popper
                className={className}
                open={Boolean(children)}
                anchorEl={this.inputEl}
                placement="bottom-start"
                {...options.suggestionsContainerProps}
            >
                <Paper
                    square
                    elevation={2}
                    className={classes.suggestionsPaper}
                    {...containerProps}
                >
                    {children}
                </Paper>
            </Popper>
        );
    };

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        const label = this.getSuggestionText(suggestion);
        const matches = match(label, query);
        const parts = parse(label, matches);
        const { classes = {}, suggestionComponent } = this.props;

        return (
            <MenuItem
                selected={isHighlighted}
                component={suggestionComponent || DefaultSuggestionComponent}
                suggestion={suggestion}
                query={query}
                isHighlighted={isHighlighted}
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

    handleBlur = () => {
        const { searching, searchText, selectedItem } = this.state;
        const { allowEmpty, input } = this.props;
        if (searching) {
            if (!searchText && allowEmpty) {
                input && input.onBlur && input.onBlur('');
            } else {
                input &&
                    input.onBlur &&
                    input.onBlur(this.getSuggestionValue(selectedItem));
                this.setState({
                    searching: false,
                    searchText: this.getSuggestionText(selectedItem),
                });
            }
        } else {
            input &&
                input.onBlur &&
                input.onBlur(this.getSuggestionValue(selectedItem));
        }
    };

    handleFocus = () => {
        this.setState({ searching: true });
    };

    shouldRenderSuggestions = val => {
        const { shouldRenderSuggestions } = this.props;
        if (
            shouldRenderSuggestions !== undefined &&
            typeof shouldRenderSuggestions === 'function'
        ) {
            return shouldRenderSuggestions(val);
        }

        return true;
    };

    render() {
        const {
            alwaysRenderSuggestions,
            classes = {},
            isRequired,
            label,
            meta,
            resource,
            source,
            className,
            options,
            ...rest
        } = this.props;
        const { searchText, suggestions } = this.state;

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={this.renderInput}
                suggestions={suggestions}
                alwaysRenderSuggestions={alwaysRenderSuggestions}
                onSuggestionSelected={this.handleSuggestionSelected}
                onSuggestionsFetchRequested={
                    this.handleSuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                    this.handleSuggestionsClearRequested
                }
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionText}
                renderSuggestion={this.renderSuggestion}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                inputProps={{
                    className,
                    classes,
                    isRequired,
                    label,
                    meta,
                    onChange: this.handleChangeFilter,
                    resource,
                    source,
                    value: searchText,
                    onBlur: this.handleBlur,
                    onFocus: this.handleFocus,
                    options,
                }}
                {...rest}
            />
        );
    }
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
    translate,
    withStyles(styles)
)(AutocompleteInput);
