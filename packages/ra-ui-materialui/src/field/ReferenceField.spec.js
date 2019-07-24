import React from 'react';
import expect from 'expect';
import { render } from 'react-testing-library';
import { MemoryRouter } from 'react-router';

import { ReferenceFieldView } from './ReferenceField';
import TextField from './TextField';

describe('<ReferenceField />', () => {
    it('should render a link to specified resourceLinkPath', () => {
        const { container } = render(
            <MemoryRouter>
                <ReferenceFieldView
                    record={{ postId: 123 }}
                    source="postId"
                    referenceRecord={{ id: 123, title: 'foo' }}
                    reference="posts"
                    resource="comments"
                    resourceLinkPath="/posts/123"
                    basePath="/comments"
                >
                    <TextField source="title" />
                </ReferenceFieldView>
            </MemoryRouter>
        );
        const links = container.getElementsByTagName('a');
        expect(links).toHaveLength(1);
        expect(links.item(0).href).toBe('http://localhost/posts/123');
    });

    it('should render no link when resourceLinkPath is not specified', () => {
        const { container } = render(
            <ReferenceFieldView
                record={{ fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath="/foo"
                resourceLinkPath={false}
            >
                <TextField source="title" />
            </ReferenceFieldView>
        );
        const links = container.getElementsByTagName('a');
        expect(links).toHaveLength(0);
    });
});
