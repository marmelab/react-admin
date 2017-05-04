import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { AutocompleteInput } from './AutocompleteInput';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a mui AutoComplete', () => {
        const wrapper = shallow(<AutocompleteInput {...defaultProps} input={{ value: 1 }} choices={[{ id: 1, name: 'hello' }]} />);
        const AutoCompleteElement = wrapper.find('AutoComplete');
        assert.equal(AutoCompleteElement.length, 1);
        assert.equal(AutoCompleteElement.prop('searchText'), 'hello');
    });

    it('should use the input parameter value as the initial input searchText', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            input={{ value: 2 }}
            choices={[{ id: 2, name: 'foo' }]}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.equal(AutoCompleteElement.prop('searchText'), 'foo');
    });

    it('should pass choices as dataSource', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
            options={{ open: true }}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.deepEqual(AutoCompleteElement.prop('dataSource'), [
            { value: 'M', text: 'Male' },
            { value: 'F', text: 'Female' },
        ]);
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            optionValue="foobar"
            choices={[
                { foobar: 'M', name: 'Male' },
            ]}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.deepEqual(AutoCompleteElement.prop('dataSource'), [
            { value: 'M', text: 'Male' },
        ]);
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            optionText="foobar"
            choices={[
                { id: 'M', foobar: 'Male' },
            ]}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.deepEqual(AutoCompleteElement.prop('dataSource'), [
            { value: 'M', text: 'Male' },
        ]);
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            optionText={choice => choice.foobar}
            choices={[
                { id: 'M', foobar: 'Male' },
            ]}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.deepEqual(AutoCompleteElement.prop('dataSource'), [
            { value: 'M', text: 'Male' },
        ]);
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
            translate={x => `**${x}**`}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.deepEqual(AutoCompleteElement.prop('dataSource'), [
            { value: 'M', text: '**Male**' },
            { value: 'F', text: '**Female**' },
        ]);
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(<AutocompleteInput
            {...defaultProps}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
            translate={x => `**${x}**`}
            translateChoice={false}
        />);
        const AutoCompleteElement = wrapper.find('AutoComplete').first();
        assert.deepEqual(AutoCompleteElement.prop('dataSource'), [
            { value: 'M', text: 'Male' },
            { value: 'F', text: 'Female' },
        ]);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(<AutocompleteInput {...defaultProps} meta={{ touched: false }} />);
            const AutoCompleteElement = wrapper.find('AutoComplete');
            assert.equal(AutoCompleteElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(<AutocompleteInput {...defaultProps} meta={{ touched: true, error: false }} />);
            const AutoCompleteElement = wrapper.find('AutoComplete');
            assert.equal(AutoCompleteElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(<AutocompleteInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />);
            const AutoCompleteElement = wrapper.find('AutoComplete');
            assert.equal(AutoCompleteElement.prop('errorText'), 'Required field.');
        });
    });
});
