import { shallow } from 'enzyme';
import assert from 'assert';
import React from 'react';
import sinon from 'sinon';

import localize from './LocalizedComponent';

describe('<LocalizedComponent />', () => {
    it('should add `translate` and `locale` prop based on context', () => {
        const Component = () => (<div>Hello world!</div>);
        const translateSpy = sinon.spy();

        const LocalizedComponent = localize(Component);
        const wrapper = shallow(<LocalizedComponent />, {
            context: {
                translate: translateSpy,
                locale: 'de',
            },
        });

        wrapper.prop('translate')();
        assert(translateSpy.called);
        assert.equal(wrapper.prop('locale'), 'de');
    });

    it('should keep all other props pristine', () => {
        const Component = () => (<div>Hello world!</div>);

        const LocalizedComponent = localize(Component);
        const wrapper = shallow(<LocalizedComponent className="awesome" />, {
            context: {
                translate: x => x,
                locale: 'fr',
            },
        });

        assert(wrapper.prop('className'), 'awesome');
    });
});
