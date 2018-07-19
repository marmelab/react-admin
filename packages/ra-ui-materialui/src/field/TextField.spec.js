import React from 'react';
import assert from 'assert';
import { render } from 'enzyme';
import TextField from './TextField';

describe('<TextField />', () => {
    it('should display record specific value as plain text', () => {
        const record = {
            title: "I'm sorry, Dave. I'm afraid I can't do that.",
        };
        const wrapper = render(<TextField record={record} source="title" />);
        assert.equal(
            wrapper.text(),
            "I'm sorry, Dave. I'm afraid I can't do that."
        );
    });

    it('should handle deep fields', () => {
        const record = {
            foo: { title: "I'm sorry, Dave. I'm afraid I can't do that." },
        };
        const wrapper = render(
            <TextField record={record} source="foo.title" />
        );
        assert.equal(
            wrapper.text(),
            "I'm sorry, Dave. I'm afraid I can't do that."
        );
    });
});
