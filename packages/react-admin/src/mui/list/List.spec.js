import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { List } from './List';

describe('<List />', () => {
    const defaultProps = {
        resource: 'post',
        hasCreate: false,
        hasEdit: false,
        location: { pathname: '' },
        params: {},
        query: {},
        filterValues: {},
        total: 100,
        isLoading: false,
        crudGetList: () => {},
        push: () => {},
        translate: () => {},
    };

    test('should display a no results text when there is no result', () => {
        const wrapper = shallow(
            <List
                {...defaultProps}
                translate={x => x}
                total={0}
                changeFormValue={() => true}
                changeListParams={() => true}
            >
                <div />
            </List>
        );
        const textElement = wrapper
            .find('withStyles(CardContent)')
            .children()
            .children();
        assert.equal(textElement.text(), 'ra.navigation.no_results');
    });

    test('should not display a no results text when there are results', () => {
        const wrapper = shallow(
            <List
                {...defaultProps}
                translate={x => x}
                total={1}
                changeFormValue={() => true}
                changeListParams={() => true}
            >
                <div />
            </List>
        );
        const textElement = wrapper.find('CardText');
        assert.equal(textElement.length, 0);
    });
});
