import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import classnames from 'classnames';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import AutocompleteInput from './AutocompleteInput';
import translate from '../../i18n/translate';

const styles = () => ({
    root: {},
    chips: {
        display: 'flex',
    },
});

class AutocompleteArrayInput extends React.Component {
    static propTypes = {
        choices: PropTypes.arrayOf(PropTypes.object),
        classes: PropTypes.object,
        optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        optionValue: PropTypes.string,
        onChipAdded: PropTypes.func,
        onChipDeleted: PropTypes.func,
        onChipClicked: PropTypes.func,
        selectedItems: PropTypes.arrayOf(PropTypes.object),
        setFilter: PropTypes.func,
        translate: PropTypes.func,
        translateChoice: PropTypes.bool,
    };
    static defaultProps = {
        addField: true,
        optionValue: 'id',
        optionText: 'name',
        fullWidth: true,
    };

    constructor(...args) {
        super(...args);
        this.state = {
            chipData: [],
            choices: [],
            input: {
                ...this.props.input,
                value: '',
                onChange: this.handleChipAdd,
                onBlur: this.handleBlur,
            },
        };
    }
    componentWillMount() {
        this.updateItems();
    }
    componentWillReceiveProps(nextProps) {
        const { input, choices } = this.props;
        if (
            nextProps.input.value !== input.value ||
            nextProps.choices !== choices
        ) {
            this.updateItems(nextProps);
        }
    }

    updateItems = ({ choices, input } = this.props) => {
        const inputValue = Array.isArray(input.value) ? input.value : [];

        const choicesGroupedByType = choices.reduce(
            (acc, choice) => {
                const selectedIndex = inputValue.indexOf(
                    this.getOptionValue(choice)
                );
                const target = selectedIndex !== -1 ? 'chipData' : 'choices';

                acc[target][
                    target === 'chipData' ? selectedIndex : acc[target].length
                ] = choice;

                return acc;
            },
            {
                chipData: [],
                choices: [],
            }
        );
        this.setState({
            chipData: this.props.selectedItems || choicesGroupedByType.chipData,
            choices: choicesGroupedByType.choices,
        });
    };

    getOptionValue = option => get(option, this.props.optionValue);

    handleChipAdd = data => {
        const { onChipAdded, input } = this.props;
        onChipAdded && onChipAdded(data);

        input.onChange(input.value ? input.value.concat(data) : [data]);

        this.setState(({ input }) => ({
            input: {
                ...input,
                value: `RA_FAKE_ID_${Date.now()}`, // This ensures Autocomplete will rerender and it doesn't find a matching choice.
            },
        }));
    };

    handleChipDelete = data => () => {
        const { onChipDeleted, input } = this.props;
        onChipDeleted && onChipDeleted(data);

        const chipValue = this.getOptionValue(data);
        input.onChange(input.value.filter(it => it !== chipValue));
    };

    handleChipClick = data => {
        const { onChipClicked } = this.props;
        onChipClicked && onChipClicked(data);
    };

    handleBlur = () => {
        const { input } = this.props;
        input.onBlur(input.value);
    };

    handleFilter = text => {
        const { setFilter } = this.props;
        setFilter && setFilter(text);
    };

    render() {
        const { children, classes, className, ...props } = this.props;
        const { chipData } = this.state;
        return (
            <AutocompleteInput
                className={classnames(classes.root, className)}
                {...props}
                choices={this.state.choices}
                input={this.state.input}
                setFilter={this.handleFilter}
                options={{
                    InputProps: {
                        startAdornment: (
                            <div className={classes.chips}>
                                {chipData.map(chip =>
                                    React.cloneElement(children, {
                                        key: this.getOptionValue(chip),
                                        record: chip,
                                        onClick: this.handleChipClick,
                                        onDelete: this.handleChipDelete(chip),
                                    })
                                )}
                            </div>
                        ),
                    },
                }}
            />
        );
    }
}

const enhance = compose(translate, withStyles(styles));
export { AutocompleteArrayInput };
export default enhance(AutocompleteArrayInput);
