import React, { Component, PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import FieldTitle from '../../util/FieldTitle';

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
 * You can customize the `filter` function used to filter the results.
 * By default, it's `AutoComplete.fuzzyFilter`, but you can use any of
 * the functions provided by `AutoComplete`, or a function of your own
 * @see http://www.material-ui.com/#/components/auto-complete
 * @example
 * import { Edit, SimpleForm, AutocompleteInput } from 'admin-on-rest/mui';
 * import AutoComplete from 'material-ui/AutoComplete';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <AutocompleteInput source="category" filter={AutoComplete.caseInsensitiveFilter} choices={choices} />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * The object passed as `options` props is passed to the material-ui <AutoComplete> component
 *
 * @example
 * <AutocompleteInput source="author_id" options={{ fullWidth: true }} />
 */
class AutocompleteInput extends Component {
    handleNewRequest = (chosenRequest, index) => {
        if (index !== -1) {
            const { choices, input, optionValue } = this.props;
            input.onChange(choices[index][optionValue]);
        }
    }

    render() {
        const { choices, elStyle, filter, input, label, options, optionText, optionValue, setFilter, source, meta: { touched, error }, resource } = this.props;

        const selectedSource = choices.find(choice => choice[optionValue] === input.value);
        const option = typeof optionText === 'function' ?
            optionText :
            choice => choice[optionText];
        const dataSource = choices.map(choice => ({
            value: choice[optionValue],
            text: option(choice),
        }));
        return (
            <AutoComplete
                searchText={selectedSource && option(selectedSource)}
                dataSource={dataSource}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
                filter={filter}
                onNewRequest={this.handleNewRequest}
                onUpdateInput={setFilter}
                openOnFocus
                style={elStyle}
                errorText={touched && error}
                {...options}
            />
        );
    }
}

AutocompleteInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    filter: PropTypes.func.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    optionElement: PropTypes.element,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    setFilter: PropTypes.func,
    source: PropTypes.string,
};

AutocompleteInput.defaultProps = {
    addField: true,
    choices: [],
    filter: AutoComplete.fuzzyFilter,
    meta: {},
    options: {},
    optionText: 'name',
    optionValue: 'id',
};

export default AutocompleteInput;
