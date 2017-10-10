import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { InfiniteList } from './InfiniteList';

describe('<InfiniteList />', () => {
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
        crudGetInfiniteList: () => {},
        push: () => {},
        translate: () => {},
    };

    it('should display a no results text when there is no result', () => {
        const wrapper = shallow(
            <InfiniteList
                {...defaultProps}
                translate={x => x}
                total={0}
                changeFormValue={() => true}
                changeInfiniteListParams={() => true}
            >
                <div />
            </InfiniteList>
        );
        const textElement = wrapper.find('CardText').children();
        assert.equal(textElement.text(), 'aor.navigation.no_results');
    });

    it('should not display a no results text when there are results', () => {
        const wrapper = shallow(
            <InfiniteList
                {...defaultProps}
                translate={x => x}
                total={1}
                changeFormValue={() => true}
                changeInfiniteListParams={() => true}
            >
                <div />
            </InfiniteList>
        );
        const textElement = wrapper.find('CardText');
        assert.equal(textElement.length, 0);
    });
});
