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

    it('should display a no results text when there is no result', () => {
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
        const textElement = wrapper.find('CardText').children();
        assert.equal(textElement.text(), 'aor.navigation.no_results');
    });

    it('should not display a no results text when there are results', () => {
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
