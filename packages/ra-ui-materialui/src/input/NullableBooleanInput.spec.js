import { shallow } from 'enzyme';
import React from 'react';

import { NullableBooleanInput } from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
        classes: {},
        translate: x => x,
    };

    it('should give three different choices for true, false or unknown', () => {
        const wrapper = shallow(
            <NullableBooleanInput source="foo" {...defaultProps} />
        );
        const MenuItemElements = wrapper.find('WithStyles(MenuItem)');
        expect(MenuItemElements.length).toEqual(3);

        const MenuItemElement1 = MenuItemElements.at(0);
        expect(MenuItemElement1.prop('value')).toEqual('');
        expect(MenuItemElement1.children().length).toEqual(0);

        const MenuItemElement2 = MenuItemElements.at(1);
        expect(MenuItemElement2.prop('value')).toEqual('false');
        expect(MenuItemElement2.childAt(0).text()).toEqual('ra.boolean.false');

        const MenuItemElement3 = MenuItemElements.at(2);
        expect(MenuItemElement3.prop('value')).toEqual('true');
        expect(MenuItemElement3.childAt(0).text()).toEqual('ra.boolean.true');
    });
});
