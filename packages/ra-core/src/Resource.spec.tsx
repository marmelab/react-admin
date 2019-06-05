import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { Resource } from './Resource';
import { Route } from 'react-router-dom';

const PostList = () => <div>PostList</div>;
const PostEdit = () => <div>PostEdit</div>;
const PostCreate = () => <div>PostCreate</div>;
const PostShow = () => <div>PostShow</div>;
const PostIcon = () => <div>PostIcon</div>;

const resource = {
    name: 'posts',
    options: { foo: 'bar' },
    list: PostList,
    edit: PostEdit,
    create: PostCreate,
    show: PostShow,
    icon: PostIcon,
};

describe('<Resource>', () => {
    const registerResource = jest.fn();
    const unregisterResource = jest.fn();

    it(`registers its resource in redux on mount when context is 'registration'`, () => {
        shallow(
            <Resource
                {...resource}
                context="registration"
                registerResource={registerResource}
                unregisterResource={unregisterResource}
            />
        );
        assert.equal(registerResource.mock.calls.length, 1);
        assert.deepEqual(registerResource.mock.calls[0][0], {
            name: 'posts',
            options: { foo: 'bar' },
            hasList: true,
            hasEdit: true,
            hasShow: true,
            hasCreate: true,
            icon: PostIcon,
        });
    });
    it(`unregister its resource from redux on unmount when context is 'registration'`, () => {
        const wrapper = shallow(
            <Resource
                {...resource}
                context="registration"
                registerResource={registerResource}
                unregisterResource={unregisterResource}
            />
        );
        wrapper.unmount();
        assert.equal(unregisterResource.mock.calls.length, 1);
        assert.deepEqual(unregisterResource.mock.calls[0][0], 'posts');
    });
    it('renders list route if specified', () => {
        const wrapper = shallow(
            <Resource
                {...resource}
                context="route"
                match={{ url: 'posts' }}
                registerResource={registerResource}
                unregisterResource={unregisterResource}
            />
        );
        assert.ok(wrapper.containsMatchingElement(<Route path="posts" />));
    });
    it('renders create route if specified', () => {
        const wrapper = shallow(
            <Resource
                {...resource}
                context="route"
                match={{ url: 'posts' }}
                registerResource={registerResource}
                unregisterResource={unregisterResource}
            />
        );
        assert.ok(wrapper.containsMatchingElement(<Route path="posts/create" />));
    });
    it('renders edit route if specified', () => {
        const wrapper = shallow(
            <Resource
                {...resource}
                context="route"
                match={{ url: 'posts' }}
                registerResource={registerResource}
                unregisterResource={unregisterResource}
            />
        );
        assert.ok(wrapper.containsMatchingElement(<Route path="posts/:id" />));
    });
    it('renders show route if specified', () => {
        const wrapper = shallow(
            <Resource
                {...resource}
                context="route"
                match={{ url: 'posts' }}
                registerResource={registerResource}
                unregisterResource={unregisterResource}
            />
        );
        assert.ok(wrapper.containsMatchingElement(<Route path="posts/:id/show" />));
    });
});
