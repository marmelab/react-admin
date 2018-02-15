import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { InnerReferenceField } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    it('should render a link to specified resourceLinkPath', () => {
        const wrapper = shallow(
            <InnerReferenceField
                record={{ postId: 123 }}
                source="postId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="posts"
                resource="comments"
                resourceLinkPath="/posts/123"
                basePath="/comments"
            >
                <TextField source="title" />
            </InnerReferenceField>
        );
        const linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.prop('to'), '/posts/123');
    });
    it('should render no link when resourceLinkPath is not specified', () => {
        const wrapper = shallow(
            <InnerReferenceField
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath="/foo"
                resourceLinkPath={false}
            >
                <TextField source="title" />
            </InnerReferenceField>
        );
        const linkElement = wrapper.find('WithStyles(Link)');
        assert.equal(linkElement.length, 0);
    });
});
