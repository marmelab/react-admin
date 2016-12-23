import React, { Component, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import title from '../../util/title';

/**
 * An Input component for an autocomplete field, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 *
 * @example
 * <AutocompleteInput source="gender" choices={[
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ]} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the `optionText` and `optionValue` props.
 *
 * @example
 * <AutocompleteInput label="Author" source="author_id" optionText="full_name" optionValue="_id" choices={[
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ]} />
 *
 * The object passed as `options` props is passed to the material-ui <Autocomplete> component
 *
 * @example
 * <AutocompleteInput source="author_id" options={{ fullWidth: true }} />
 */
class AutocompleteInput extends Component {
    onNewRequest = (chosenRequest, index) => {
        if (index !== -1) {
            const { choices, input, optionValue } = this.props;
            input.onChange(choices[index][optionValue]);
        }
    }

    render() {
        const { choices, elStyle, input, label, options, optionText, optionValue, setFilter, source } = this.props;
        const selectedSource = choices.find(choice => choice[optionValue] === input.value);
        const dataSource = choices.map(choice => ({
            value: choice[optionValue],
            text: choice[optionText],
        }));
        return (
            <AutoComplete
                searchText={selectedSource && selectedSource[optionText]}
                dataSource={dataSource}
                floatingLabelText={title(label, source)}
                filter={AutoComplete.noFilter}
                onNewRequest={this.onNewRequest}
                onUpdateInput={setFilter}
                openOnFocus
                style={elStyle}
                {...options}
            />
        );
    }
}

AutocompleteInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.string.isRequired,
    optionValue: PropTypes.string.isRequired,
    setFilter: PropTypes.func,
    source: PropTypes.string,
};

AutocompleteInput.defaultProps = {
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    includesLabel: true,
};

export default AutocompleteInput;
