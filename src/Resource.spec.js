import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'enzyme';
import assert from 'assert';

import Resource from './Resource';

describe('<Resource>', () => {
    const PostList = () => <div>PostList</div>;
    const PostEdit = () => <div>PostEdit</div>;
    const PostCreate = () => <div>PostCreate</div>;
    const PostShow = () => <div>PostShow</div>;
    const PostDelete = () => <div>PostDelete</div>;

    const resource = {
        name: 'posts',
        list: PostList,
        edit: PostEdit,
        create: PostCreate,
        show: PostShow,
        remove: PostDelete,
    };

    // the Provider is required because all resources routes are wrapped by <Restricted>, which is a connected component
    const store = createStore(x => x);

    it('should show resource list on /[resourcename]', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts']}>
                    <Resource {...resource} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostList</div>');
    });
    it('should show resource edit on /[resourcename]/:id', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12']}>
                    <Resource {...resource} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostEdit</div>');
    });
    it('should show resource show on /[resourcename]/:id/show', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12/show']}>
                    <Resource {...resource} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostShow</div>');
    });
    it('should show resource delete on /[resourcename]/:id/delete', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12/delete']}>
                    <Resource {...resource} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostDelete</div>');
    });
});
