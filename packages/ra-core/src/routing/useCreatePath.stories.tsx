import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import { BasenameContextProvider } from './BasenameContextProvider';
import { useBasename } from './useBasename';
import { useCreatePath } from './useCreatePath';
import { FakeBrowserDecorator } from '../storybook//FakeBrowser';
import { LinkBase } from './LinkBase';

export default {
    title: 'ra-core/routing/useCreatePath',
    decorators: [FakeBrowserDecorator],
};

const Home = () => {
    const createPath = useCreatePath();
    return (
        <>
            <h1>Home</h1>
            <ul>
                <li>
                    <LinkBase
                        to={createPath({
                            resource: 'posts',
                            type: 'list',
                        })}
                    >
                        Post list
                    </LinkBase>
                </li>
                <li>
                    <LinkBase
                        to={createPath({
                            resource: 'posts',
                            type: 'edit',
                            id: 123,
                        })}
                    >
                        Post detail
                    </LinkBase>
                </li>
            </ul>
        </>
    );
};

const PostList = () => {
    const basename = useBasename();
    return (
        <div>
            <h1>Posts</h1>
            <LinkBase to={`${basename}/`}>Home</LinkBase>
        </div>
    );
};

const PostDetail = () => {
    const basename = useBasename();
    return (
        <div>
            <h1>Post 123</h1>
            <LinkBase to={`${basename}/`}>Home</LinkBase>
        </div>
    );
};

export const AtRoot = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/123" element={<PostDetail />} />
    </Routes>
);

export const SubPath = () => (
    <Routes>
        <Route
            path="/"
            element={
                <>
                    <h1>Main</h1>
                    <div>
                        <LinkBase to="/admin">Go to admin</LinkBase>
                    </div>
                </>
            }
        />
        <Route
            path="/admin/*"
            element={
                <BasenameContextProvider basename="/admin">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/posts" element={<PostList />} />
                        <Route path="/posts/123" element={<PostDetail />} />
                    </Routes>
                </BasenameContextProvider>
            }
        />
    </Routes>
);
