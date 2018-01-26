import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Downshift from 'downshift';
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
    suggestionsContainer: {
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
        selectedItem: null,
        searchText: '',
        suggesting: false,
    };

    componentWillMount() {
        this.updateState();
    }

    updateState = (
        stateToMerge,
        { selectedItem, choices, input, meta } = this.props
    ) => {
        // The current selectedItem can be supplied with a prop or should be derived from the supplied choices
        selectedItem =
            selectedItem ||
            (choices &&
                input.value &&
                choices.find(
                    choice => this.getOptionValue(choice) === input.value
                )) ||
            null;
        // Remember the current selectedItem and make sure only to update the searchText if the user is not editing it
        this.setState(({ searchText, suggesting }) => ({
            ...stateToMerge,
            selectedItem,
            searchText:
                meta.active && suggesting
                    ? searchText
                    : this.getOptionText(selectedItem),
        }));
    };

    componentWillReceiveProps(nextProps) {
        const { selectedItem, input, choices } = nextProps;
        // If the selecteditem changed or the input value changed, reevaluate the current state
        if (
            selectedItem !== this.props.selectedItem ||
            input.value !== this.props.input.value ||
            choices !== this.props.choices
        ) {
            this.updateState(undefined, nextProps);
        }
    }
    getOptionValue = suggestion =>
        suggestion && get(suggestion, this.props.optionValue);

    getOptionText = suggestion => {
        if (suggestion === null) return '';

        const { optionText, translate, translateChoice } = this.props;
        const suggestionLabel =
            typeof optionText === 'function'
                ? optionText(suggestion)
                : get(suggestion, optionText);
        return translateChoice
            ? translate(suggestionLabel, { _: suggestionLabel })
            : suggestionLabel;
    };

    mapSearchTextToInputValue = searchText => {
        const { choices } = this.props;
        const { selectedItem } = this.state;
        if (searchText === this.getOptionText(selectedItem))
            return this.getOptionValue(selectedItem);

        const choice = choices.find(
            choice => this.getOptionText(choice) === searchText
        );

        return choice ? this.getOptionValue(choice) : null;
    };

    handleInputValueChange = searchText => {
        if (this.props.meta.active) {
            const didChange =
                this.getOptionText(this.state.selectedItem) !== searchText;

            const inputValue = this.mapSearchTextToInputValue(searchText);
            if (
                this.props.input.value !== inputValue &&
                (inputValue || (!inputValue && this.props.allowEmpty))
            ) {
                this.props.input.onChange(inputValue);
            }
            this.setState({
                searchText,
                suggesting: !inputValue && didChange,
            });

            if (!inputValue) {
                // Only show suggestions if the current inputvalue didn't map to an inputvalue
                this.props.setFilter(searchText);
            }
        }
    };

    handleFocus = () => {
        this.props.input.onFocus();
    };
    handleBlur = () => {
        this.props.input.onBlur(this.props.input.value);
        this.updateState({
            suggesting: false,
        });
    };

    renderInput = (getInputProps, getLabelProps) => {
        const {
            autoFocus,
            className,
            classes = {},
            meta,
            label,
            source,
            resource,
            isRequired,
        } = this.props;

        const { touched, error } = meta;
        return (
            <TextField
                {...getInputProps({
                    autoFocus,
                    className: classnames(classes.root, className),
                    error: !!(touched && error),
                    helperText: touched && error,
                    label: (
                        <FieldTitle
                            {...getLabelProps({
                                label,
                                source,
                                resource,
                                isRequired,
                            })}
                        />
                    ),
                    margin: 'normal',
                    InputProps: {
                        classes: {
                            input: classes.input,
                        },
                    },
                    onFocus: this.handleFocus,
                    onBlur: this.handleBlur,
                })}
            />
        );
    };

    renderSuggestionsContainer = ({ children }) => {
        const { classes } = this.props;

        return (
            <Paper className={classes.suggestionsContainer} square>
                {children}
            </Paper>
        );
    };

    renderSuggestionContainer = ({ suggestion, ...props }) => (
        <div {...props} />
    );

    renderSuggestion = ({ suggestion, isHighlighted, ...rest }) => {
        const label = this.getOptionText(suggestion);
        const matches = match(label, this.state.searchText);
        const parts = parse(label, matches);
        const { classes = {}, optionComponent } = this.props;

        return (
            <MenuItem
                selected={isHighlighted}
                suggestion={suggestion}
                component={optionComponent || this.renderSuggestionContainer}
                {...rest}
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

    handleAutosuggestChange = suggestion => {
        const suggestionValue = this.getOptionValue(suggestion);
        const suggestionText = this.getOptionText(suggestion);

        if (this.props.input.value !== suggestionValue) {
            this.props.input.onChange(suggestionValue);
        }
        this.setState({
            selectedItem: suggestion,
            searchText: suggestionText,
            suggesting: false,
        });
    };

    getChoices = () =>
        !this.state.suggesting && this.props.input.value
            ? [this.state.selectedItem]
            : this.props.choices;

    renderAutosuggest = ({
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        highlightedIndex,
    }) => {
        const { classes = {} } = this.props;
        return (
            <div className={classes.container}>
                {this.renderInput(getInputProps, getLabelProps)}
                {isOpen
                    ? this.renderSuggestionsContainer({
                          children: this.getChoices().map((choice, index) =>
                              this.renderSuggestion({
                                  key: this.getOptionText(choice),
                                  suggestion: choice,
                                  index,
                                  isHighlighted: highlightedIndex === index,
                                  ...getItemProps({ item: choice }),
                              })
                          ),
                      })
                    : null}
            </div>
        );
    };

    render() {
        const { isOpen } = this.props;
        return (
            <Downshift
                isOpen={isOpen}
                onChange={this.handleAutosuggestChange}
                onInputValueChange={this.handleInputValueChange}
                inputValue={this.state.searchText}
                itemToString={this.getOptionText}
                render={this.renderAutosuggest}
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
    input: PropTypes.object,
    isOpen: PropTypes.bool,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
    optionValue: PropTypes.string.isRequired,
    optionComponent: PropTypes.func,
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
