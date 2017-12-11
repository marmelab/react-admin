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
        searchText: '',
        suggestions: [],
    };

    componentWillMount() {
        const { input, choices } = this.props;
        this.setState({
            searchText: this.getSearchText(input.value) || '',
            suggestions: choices,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(state => {
            let newState = {};
            if (this.props.input.value !== nextProps.input.value) {
                newState.searchText = this.getSearchText(nextProps.input.value);
            }
            if (this.props.choices !== nextProps.choices) {
                newState.suggestions = nextProps.choices;
            }
            return { ...state, ...newState };
        });
    }

    getSearchText = value => {
        const { choices, optionValue } = this.props;
        const suggestion = choices.find(
            choice => get(choice, optionValue) === value
        );
        return suggestion && this.getSuggestionLabel(suggestion);
    };

    getSuggestionValue = suggestion => {
        return get(suggestion, this.props.optionText);
    };

    getSuggestionLabel = suggestion => {
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
        this.props.input.onChange(get(suggestion, this.props.optionValue));
        if (method === 'enter') {
            event.preventDefault();
        }
    };

    handleSuggestionsFetchRequested = ({ value: searchText, reason }) => {
        if (reason === 'input-focused') {
            // do not fetch on focus, the data is prefeteched already
            return;
        }
        const { setFilter } = this.props;
        setFilter && setFilter(searchText);
    };

    handleSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    };

    handleChange = (event, { newValue }) => {
        this.setState({ searchText: newValue });
    };

    renderInput = inputProps => {
        const {
            autoFocus,
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
                className={classes.root}
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
        const label = this.getSuggestionLabel(suggestion);
        const matches = match(label, query);
        const parts = parse(label, matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={index} style={{ fontWeight: 500 }}>
                                {part.text}
                            </span>
                        ) : (
                            <strong key={index} style={{ fontWeight: 300 }}>
                                {part.text}
                            </strong>
                        );
                    })}
                </div>
            </MenuItem>
        );
    };

    shouldRenderSuggestions = () => true;

    render() {
        const {
            alwaysRenderSuggestions,
            classes = {},
            elStyle,
            isRequired,
            label,
            meta,
            resource,
            source,
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
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                inputProps={{
                    classes,
                    isRequired,
                    label,
                    meta,
                    onChange: this.handleChange,
                    resource,
                    source,
                    value: searchText,
                }}
                style={elStyle}
            />
        );
    }
}

AutocompleteInput.propTypes = {
    alwaysRenderSuggestions: PropTypes.bool, // used only for unit tests
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    elStyle: PropTypes.object,
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
