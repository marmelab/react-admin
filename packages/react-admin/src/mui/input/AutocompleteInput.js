import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import compose from 'recompose/compose';
import classnames from 'classnames';

import FieldTitle from '../../util/FieldTitle';
import addField from '../form/addField';
import translate from '../../i18n/translate';

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
        searchText: '',
        selectedItem: null,
        suggestions: [],
    };

    componentWillMount() {
        const selectedItem = this.getSelectedItem();
        this.setState({
            selectedItem,
            searchText: this.getSuggestionText(selectedItem),
            suggestions: selectedItem ? [selectedItem] : this.props.choices,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { choices, input } = nextProps;
        if (input.value !== this.props.input.value) {
            const selectedItem = this.getSelectedItem(nextProps);
            this.setState(({ dirty, searchText }) => ({
                selectedItem,
                searchText:
                    dirty && !input.value
                        ? searchText
                        : this.getSuggestionText(selectedItem),
                dirty: dirty && !input.value ? dirty : false,
                suggestions: selectedItem ? [selectedItem] : this.props.choices,
            }));
        }
        if (choices !== this.props.choices) {
            const selectedItem = this.getSelectedItem(nextProps);
            this.setState(({ dirty, searchText }) => ({
                selectedItem,
                searchText: dirty
                    ? searchText
                    : this.getSuggestionText(selectedItem),
                suggestions: choices,
            }));
        }
    }

    getSelectedItem = ({ selectedItem, choices, input } = this.props) =>
        selectedItem
            ? selectedItem
            : choices && input.value
              ? choices.find(
                    choice => this.getSuggestionValue(choice) === input.value
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
        return translateChoice
            ? translate(suggestionLabel, { _: suggestionLabel })
            : suggestionLabel;
    };

    handleSuggestionSelected = (event, { suggestion, method }) => {
        this.props.input.onChange(this.getSuggestionValue(suggestion));

        this.setState({
            dirty: false,
            selectedItem: suggestion,
            searchText: this.getSuggestionText(suggestion),
            suggestions: [suggestion],
        });
        if (method === 'enter') {
            event.preventDefault();
        }
    };

    handleSuggestionsFetchRequested = ({ value: inputValue }) => {
        const { dirty, searchText, suggestions } = this.state;
        const { setFilter, choices } = this.props;

        const changed = inputValue !== searchText;
        this.setState({
            searchText: inputValue,
            dirty: changed ? true : dirty,
            suggestions: changed
                ? choices
                : suggestions.length === 0 ? choices : suggestions,
        });
        changed && setFilter && setFilter(inputValue);
    };

    handleSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    };

    handleChange = () => {
        this.props.allowEmpty &&
            this.props.input.value &&
            this.props.input.onChange(null);
    };

    renderInput = inputProps => {
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
            ...other
        } = inputProps;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The TextInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;
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
                inputRef={ref}
                error={!!(touched && error)}
                helperText={touched && error}
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                    ...other,
                }}
            />
        );
    };

    renderSuggestionsContainer = options => {
        const { containerProps, children } = options;

        return (
            <Paper {...containerProps} square>
                {children}
            </Paper>
        );
    };

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        const label = this.getSuggestionText(suggestion);
        const matches = match(label, query);
        const parts = parse(label, matches);
        const { classes = {} } = this.props;

        return (
            <MenuItem selected={isHighlighted} component="div">
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
        this.input && this.input.onBlur && this.input.onBlur(this.input.value);
        this.setState({
            dirty: false,
            searchText: this.getSuggestionText(this.state.selectedItem),
        });
    };

    handleFocus = () => {};

    shouldRenderSuggestions = () => true;

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
            InputProps,
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
                    ...InputProps,
                }}
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
    meta: PropTypes.object,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    setFilter: PropTypes.func,
    source: PropTypes.string,
    selectedItem: PropTypes.object,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

AutocompleteInput.defaultProps = {
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default compose(addField, translate, withStyles(styles))(
    AutocompleteInput
);
