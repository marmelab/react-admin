import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { SelectField } from './SelectField';

describe('<SelectField />', () => {
    const defaultProps = {
        source: 'foo',
        choices: [{ id: 0, name: 'hello' }, { id: 1, name: 'world' }],
        translate: x => x,
    };

    it('should return null when the record is not set', () =>
        assert.equal(shallow(<SelectField {...defaultProps} />).html(), null));

    it('should return null when the record has no value for the source', () =>
        assert.equal(shallow(<SelectField {...defaultProps} record={{}} />).html(), null));

    it('should return null when the record has a value for the source not in the choices', () =>
        assert.equal(shallow(<SelectField {...defaultProps} record={{ foo: 2 }} />).html(), null));

    it('should render the choice', () => {
        const wrapper = shallow(<SelectField {...defaultProps} record={{ foo: 0 }} />);
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), 'hello');
    });

    it('should use custom className', () => {
        const wrapper = shallow(
            <SelectField {...defaultProps} record={{ foo: 1 }} elStyle={{ margin: 1 }} className="foo" />
        );
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.deepEqual(chipElement.prop('className'), 'foo');
    });

    it('should handle deep fields', () => {
        const wrapper = shallow(<SelectField {...defaultProps} record={{ foo: { bar: 0 } }} source="foo.bar" />);
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), 'hello');
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionValue="foobar"
                choices={[{ foobar: 0, name: 'hello' }]}
            />
        );
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), 'hello');
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionText="foobar"
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), 'hello');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionText={choice => choice.foobar}
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), 'hello');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const wrapper = shallow(
            <SelectField
                {...defaultProps}
                record={{ foo: 0 }}
                optionText={<Foobar />}
                choices={[{ id: 0, foobar: 'hello' }]}
            />
        );
        const chipElement = wrapper.find('Foobar');
        assert.deepEqual(chipElement.prop('record'), {
            id: 0,
            foobar: 'hello',
        });
    });

    it('should translate the choice by default', () => {
        const wrapper = shallow(<SelectField {...defaultProps} record={{ foo: 0 }} translate={x => `**${x}**`} />);
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), '**hello**');
    });

    it('should not translate the choice if translateChoice is false', () => {
        const wrapper = shallow(
            <SelectField {...defaultProps} record={{ foo: 0 }} translate={x => `**${x}**`} translateChoice={false} />
        );
        const chipElement = wrapper.find('WithStyles(Typography)');
        assert.equal(chipElement.children().text(), 'hello');
    });
});
