import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import TextField from './TextField';

describe('<TextField />', () => {
    it('should display record specific value as plain text', () => {
        const record = {
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const wrapper = shallow(<TextField record={record} source="title" />);
        assert.equal(
            wrapper.html(),
            '<span>I&#x27;m sorry, Dave. I&#x27;m afraid I can&#x27;t do that.</span>'
        );
    });

    it('should handle deep fields', () => {
        const record = {
            foo: { title: "I'm sorry, Dave. I'm afraid I can't do that." },
        };
        const wrapper = shallow(
            <TextField record={record} source="foo.title" />
        );
        assert.equal(
            wrapper.html(),
            '<span>I&#x27;m sorry, Dave. I&#x27;m afraid I can&#x27;t do that.</span>'
        );
    });
});
