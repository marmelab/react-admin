import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import compose from 'recompose/compose';
import classnames from 'classnames';

import { addField, translate, FieldTitle } from 'ra-core';

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    root: {},
    suggestionsContainerOpen: {
        position: 'absolute',
        marginBottom: theme.spacing.unit * 3,
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
    state = {
        dirty: false,
        inputValue: null,
        searchText: '',
        selectedItem: null,
        suggestions: [],
    };

    inputEl = null;

    componentWillMount() {
        const selectedItem = this.getSelectedItem(
            this.props,
            this.props.input.value
        );
        this.setState({
            selectedItem,
            inputValue: this.props.input.value,
            searchText: this.getSuggestionText(selectedItem),
            suggestions:
                this.props.limitChoicesToValue && selectedItem
                    ? [selectedItem]
                    : this.props.choices,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { choices, input, limitChoicesToValue } = nextProps;
        if (input.value !== this.state.inputValue) {
            const selectedItem = this.getSelectedItem(nextProps, input.value);
            this.setState({
                selectedItem,
                inputValue: input.value,
                searchText: this.getSuggestionText(selectedItem),
                dirty: false,
                suggestions:
                    limitChoicesToValue && selectedItem
                        ? [selectedItem]
                        : this.props.choices,
                prevSuggestions: false,
            });
            // Ensure to reset the filter
            this.updateFilter('');
        } else if (!isEqual(choices, this.props.choices)) {
            const selectedItem = this.getSelectedItem(
                nextProps,
                this.state.inputValue
            );
            this.setState(({ dirty, searchText }) => ({
                selectedItem,
                searchText: dirty
                    ? searchText
                    : this.getSuggestionText(selectedItem),
                suggestions:
                    limitChoicesToValue && !dirty && selectedItem
                        ? [selectedItem]
                        : choices,
                prevSuggestions: false,
            }));
        }
    }

    getSelectedItem = ({ choices }, inputValue) =>
        choices && inputValue
            ? choices.find(
                  choice => this.getSuggestionValue(choice) === inputValue
              )
            : null;

    getSuggestionValue = suggestion => get(suggestion, this.props.optionValue);

    getSuggestionText = suggestion => {
        if (!suggestion) return '';

        const { optionText, translate, translateChoice } = this.props;
        const suggestionLabel =
            typeof optionText === 'function'
                ? optionText(suggestion)
                : get(suggestion, optionText);

        // We explicitly call toString here because AutoSuggest expect a string
        return translateChoice
            ? translate(suggestionLabel, { _: suggestionLabel }).toString()
            : suggestionLabel.toString();
    };

    handleSuggestionSelected = (event, { suggestion, method }) => {
        const { input } = this.props;

        const inputValue = this.getSuggestionValue(suggestion);
        this.setState(
            {
                dirty: false,
                inputValue,
                selectedItem: suggestion,
                searchText: this.getSuggestionText(suggestion),
                suggestions: [suggestion],
            },
            () => input && input.onChange && input.onChange(inputValue)
        );

        if (method === 'enter') {
            event.preventDefault();
        }
    };

    handleSuggestionsFetchRequested = () => {
        this.setState(({ suggestions, prevSuggestions }) => ({
            suggestions: prevSuggestions ? prevSuggestions : suggestions,
        }));
    };

    handleSuggestionsClearRequested = () => {
        this.updateFilter('');
    };

    handleMatchSuggestionOrFilter = inputValue => {
        const { choices, inputValueMatcher, input } = this.props;

        const matches =
            inputValue &&
            choices.filter(it =>
                inputValueMatcher(inputValue, it, this.getSuggestionText)
            );

        if (matches.length === 1) {
            const match = matches[0];
            const nextId = this.getSuggestionValue(match);
            const suggestionText = this.getSuggestionText(match);

            if (this.state.inputValue !== nextId) {
                this.setState(
                    {
                        inputValue: nextId,
                        searchText: suggestionText, // The searchText could be whatever the inputvalue matcher likes, so sanitize it
                        selectedItem: match,
                        suggestions: [match],
                    },
                    () => input.onChange(nextId)
                );
            } else {
                this.setState({
                    dirty: false,
                    suggestions: [match],
                    searchText: suggestionText,
                });
            }
        } else {
            this.setState({
                dirty: true,
                searchText: inputValue,
            });
            this.updateFilter(inputValue);
        }
    };

    handleChange = (event, { newValue, method }) => {
        switch (method) {
            case 'type':
            case 'escape':
                {
                    this.handleMatchSuggestionOrFilter(newValue);
                }
                break;
        }
    };

    renderInput = inputProps => {
        const { input } = this.props;
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
            options: { InputProps, ...options },
            ...other
        } = inputProps;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The TextInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }

        const { touched, error, helperText = false } = meta;

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
                margin="normal"
                className={classnames(classes.root, className)}
                inputRef={storeInputRef}
                error={!!(touched && error)}
                helperText={(touched && error) || helperText}
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

    renderSuggestionsContainer = options => {
        const {
            containerProps: { className, ...containerProps },
            children,
        } = options;
        const { classes = {} } = this.props;

        return (
            <Popper
                className={className}
                open
                anchorEl={this.inputEl}
                placement="bottom-start"
            >
                <Paper
                    square
                    className={classes.suggestionsPaper}
                    {...containerProps}
                >
                    {children}
                </Paper>
            </Popper>
        );
    };

    renderSuggestionComponent = ({
        suggestion,
        query,
        isHighlighted,
        ...props
    }) => <div {...props} />;

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        const label = this.getSuggestionText(suggestion);
        const matches = match(label, query);
        const parts = parse(label, matches);
        const { classes = {}, suggestionComponent } = this.props;

        return (
            <MenuItem
                selected={isHighlighted}
                component={
                    suggestionComponent || this.renderSuggestionComponent
                }
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
        const { dirty, searchText, selectedItem } = this.state;
        const { allowEmpty, input } = this.props;
        if (dirty) {
            if (searchText === '' && allowEmpty) {
                input && input.onBlur && input.onBlur(null);
            } else {
                input && input.onBlur && input.onBlur(this.state.inputValue);
                this.setState({
                    dirty: false,
                    searchText: this.getSuggestionText(selectedItem),
                    suggestions:
                        this.props.limitChoicesToValue && selectedItem
                            ? [selectedItem]
                            : this.props.choices,
                });
            }
        } else {
            input && input.onBlur && input.onBlur(this.state.inputValue);
        }
    };

    handleFocus = () => {
        const { input } = this.props;
        input && input.onFocus && input.onFocus();
    };

    updateFilter = value => {
        const { setFilter, choices } = this.props;
        if (this.previousFilterValue !== value) {
            if (setFilter) {
                setFilter(value);
            } else {
                this.setState({
                    suggestions: choices.filter(choice =>
                        this.getSuggestionText(choice)
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    ),
                });
            }
        }
        this.previousFilterValue = value;
    };

    shouldRenderSuggestions = (val) => {
      const { shouldRenderSuggestions } = this.props;
      if (shouldRenderSuggestions !== undefined && typeof shouldRenderSuggestions === 'function') {
        return shouldRenderSuggestions(val)
      }

      return true
    }

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
        const { suggestions, searchText } = this.state;

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
                    onChange: this.handleChange,
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
    suggestionComponent: PropTypes.func,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
    inputValueMatcher: PropTypes.func,
};

AutocompleteInput.defaultProps = {
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    limitChoicesToValue: false,
    translateChoice: true,
    inputValueMatcher: (input, suggestion, getOptionText) =>
        getOptionText(suggestion)
            .toLowerCase()
            .trim()
            .includes(input.toLowerCase().trim()),
};

export default compose(
    addField,
    translate,
    withStyles(styles)
)(AutocompleteInput);
