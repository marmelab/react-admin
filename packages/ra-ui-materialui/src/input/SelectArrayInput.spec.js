import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { SelectArrayInput } from './SelectArrayInput';
import { ChipField } from '../field/ChipField';

describe('<SelectArrayInput />', () => {
    const defaultProps = {
        classes: {},
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a mui Select', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                input={{ value: ['programming'] }}
            />
        );

        const SelectFieldElement = wrapper.find('WithStyles(Select)');
        assert.equal(SelectFieldElement.length, 1);
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                input={{ value: ['programming', 'lifestyle'] }}
            />
        );
        const SelectFieldElement = wrapper.find('WithStyles(Select)');
        assert.deepEqual(SelectFieldElement.prop('value'), [
            'programming',
            'lifestyle',
        ]);
    });

    it('should render choices as mui MenuItem components', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                choices={[
                    { id: 'programming', name: 'Programming' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'photography', name: 'Photography' },
                ]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        assert.equal(MenuItemElements.length, 3);
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'programming');
        assert.equal(MenuItemElement1.childAt(0).text(), 'Programming');
        const MenuItemElement2 = MenuItemElements.at(1);
        assert.equal(MenuItemElement2.prop('value'), 'lifestyle');
        assert.equal(MenuItemElement2.childAt(0).text(), 'Lifestyle');
        const MenuItemElement3 = MenuItemElements.at(2);
        assert.equal(MenuItemElement3.prop('value'), 'photography');
        assert.equal(MenuItemElement3.childAt(0).text(), 'Photography');
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionValue="foobar"
                choices={[{ foobar: 'M', name: 'Male' }]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).text(), 'Male');
    });

    it('should use optionValue including "." as value identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'M' }, name: 'Male' }]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).text(), 'Male');
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).text(), 'Male');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).text(), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).text(), 'Male');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText={<Foobar />}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).type(), Foobar);
        assert.deepEqual(MenuItemElement1.childAt(0).prop('record'), {
            id: 'M',
            foobar: 'Male',
        });
    });

    it('should translate the choices', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translate={x => `**${x}**`}
            />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.childAt(0).text(), '**Male**');
    });

    it('should displayed helperText if prop is present in meta', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                meta={{ helperText: 'Can i help you?' }}
            />
        );
        const helperText = wrapper.find('WithStyles(FormHelperText)');
        assert.equal(helperText.length, 1);
        assert.equal(helperText.childAt(0).text(), 'Can i help you?');
    });

    describe('rendering children', () => {
        it('should render its children', () => {
            const wrapper = shallow(
                <SelectArrayInput
                    {...defaultProps}
                    input={{ value: ['M'] }}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                >
                    <ChipField source="name" />
                </SelectArrayInput>
            )
                .find('WithStyles(Select)')
                .dive()
                .dive()
                .dive()
                .dive()
                .find('SelectInput')
                .dive();
            expect(wrapper.find('ChipField')).toHaveLength(1);
            expect(wrapper.find('ChipField').prop('record')).toEqual({
                id: 'M',
                name: 'Male',
            });
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <SelectArrayInput {...defaultProps} meta={{ touched: false }} />
            );
            const helperText = wrapper.find('WithStyles(FormHelperText)');
            assert.equal(helperText.length, 0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <SelectArrayInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const helperText = wrapper.find('WithStyles(FormHelperText)');
            assert.equal(helperText.length, 0);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <SelectArrayInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const helperText = wrapper.find('WithStyles(FormHelperText)');
            assert.equal(helperText.length, 1);
            assert.equal(helperText.childAt(0).text(), 'Required field.');
        });

        it('should be displayed with an helper Text', () => {
            const wrapper = shallow(
                <SelectArrayInput
                    {...defaultProps}
                    meta={{
                        touched: true,
                        error: 'Required field.',
                        helperText: 'Can i help you?',
                    }}
                />
            );
            const helperText = wrapper.find('WithStyles(FormHelperText)');
            assert.equal(helperText.length, 2);
            assert.equal(
                helperText
                    .at(0)
                    .childAt(0)
                    .text(),
                'Required field.'
            );
            assert.equal(
                helperText
                    .at(1)
                    .childAt(0)
                    .text(),
                'Can i help you?'
            );
        });
    });
});
