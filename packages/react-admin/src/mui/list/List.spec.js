import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { List } from './List';

describe('<List />', () => {
    const defaultProps = {
        crudGetList: () => {},
        filterValues: {},
        hasCreate: false,
        hasDelete: false,
        hasEdit: false,
        hasList: true,
        hasShow: false,
        ids: [],
        isLoading: false,
        location: { pathname: '' },
        params: {},
        push: () => {},
        query: {},
        refreshView: () => {},
        resource: 'post',
        setSelectedIds: () => {},
        toggleItem: () => {},
        total: 100,
        translate: () => {},
        version: 1,
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
        const textElement = wrapper
            .find('WithStyles(CardContent)')
            .children()
            .children();
        assert.equal(textElement.text(), 'ra.navigation.no_results');
    });

    it('should not display a no results text when there are results', () => {
        const wrapper = shallow(
            <List
                {...defaultProps}
                translate={x => x}
                total={1}
                ids={[1]}
                changeFormValue={() => true}
                changeListParams={() => true}
            >
                <div />
            </List>
        );
        const textElement = wrapper.find('CardText');
        assert.equal(textElement.length, 0);
    });

    it('should display a no more results text on an empty paginated page', () => {
        const wrapper = shallow(
            <List
                {...defaultProps}
                translate={x => x}
                total={10}
                ids={[]}
                page={2}
                perPage={10}
                changeFormValue={() => true}
                changeListParams={() => true}
            >
                <div />
            </List>
        );
        const textElement = wrapper.find('WithStyles(Typography)').children();
        assert.equal(textElement.text(), 'ra.navigation.no_more_results');
    });
});
