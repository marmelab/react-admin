import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { UnconnectedReferenceFieldController as ReferenceFieldController } from './ReferenceFieldController';

describe('<ReferenceFieldController />', () => {
    it('should call crudGetManyAccumulate on componentDidMount if reference source is defined', () => {
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                children={jest.fn()} // eslint-disable-line react/no-children-prop
                record={{ id: 1, postId: 123 }}
                source="postId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="posts"
                basePath=""
                crudGetManyAccumulate={crudGetManyAccumulate}
            />
        );
        assert.equal(crudGetManyAccumulate.mock.calls.length, 1);
    });
    it('should not call crudGetManyAccumulate on componentDidMount if reference source is null or undefined', () => {
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                children={jest.fn()} // eslint-disable-line react/no-children-prop
                record={{ id: 1, postId: null }}
                source="postId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="posts"
                basePath=""
                crudGetManyAccumulate={crudGetManyAccumulate}
            />
        );
        assert.equal(crudGetManyAccumulate.mock.calls.length, 0);
    });
    it('should render a link to the Edit page of the related record by default', () => {
        const children = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="posts"
                resource="comments"
                basePath="/comments"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(children.mock.calls[0][0].resourceLinkPath, '/posts/123');
    });
    it('should render a link to the Edit page of the related record when the resource contains slashes', () => {
        const children = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="prefix/posts"
                resource="prefix/comments"
                basePath="/prefix/comments"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(
            children.mock.calls[0][0].resourceLinkPath,
            '/prefix/posts/123'
        );
    });
    it('should render a link to the Edit page of the related record when the resource is named edit or show', () => {
        const children = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="edit"
                resource="show"
                basePath="/show"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(children.mock.calls[0][0].resourceLinkPath, '/edit/123');

        shallow(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="show"
                resource="edit"
                basePath="/edit"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(children.mock.calls[1][0].resourceLinkPath, '/show/123');
    });
    it('should render a link to the Show page of the related record when the linkType is show', () => {
        const children = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                record={{ id: 1, postId: 123 }}
                source="postId"
                referenceRecord={{ id: 123, title: 'foo' }}
                resource="comments"
                reference="posts"
                basePath="/comments"
                linkType="show"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(
            children.mock.calls[0][0].resourceLinkPath,
            '/posts/123/show'
        );
    });
    it('should render a link to the Show page of the related record when the resource is named edit or show and linkType is show', () => {
        const children = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="edit"
                resource="show"
                basePath="/show"
                linkType="show"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(
            children.mock.calls[0][0].resourceLinkPath,
            '/edit/123/show'
        );

        shallow(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="show"
                resource="edit"
                basePath="/edit"
                linkType="show"
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );

        assert.equal(
            children.mock.calls[1][0].resourceLinkPath,
            '/show/123/show'
        );
    });
    it('should render no link when the linkType is false', () => {
        const children = jest.fn();
        const crudGetManyAccumulate = jest.fn();
        shallow(
            <ReferenceFieldController
                record={{ id: 1, fooId: 123 }}
                source="fooId"
                referenceRecord={{ id: 123, title: 'foo' }}
                reference="bar"
                basePath="/foo"
                linkType={false}
                crudGetManyAccumulate={crudGetManyAccumulate}
            >
                {children}
            </ReferenceFieldController>
        );
        assert.equal(children.mock.calls[0][0].resourceLinkPath, false);
    });
});
