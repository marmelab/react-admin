import * as React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { FakeBrowserDecorator } from '../storybook//FakeBrowser';
import { useRedirect as useRedirectRA } from './useRedirect';

export default {
    title: 'ra-core/routing',
    decorators: [FakeBrowserDecorator],
};

const Home = () => {
    const redirect = useRedirectRA();
    return (
        <>
            <h1>Home</h1>
            <ul>
                <li>
                    <button onClick={() => redirect('/dashboard')}>
                        Dashboard
                    </button>
                </li>
                <li>
                    <button onClick={() => redirect('list', 'posts')}>
                        Post list
                    </button>
                </li>
                <li>
                    <button onClick={() => redirect('edit', 'posts', 123)}>
                        123th post detail
                    </button>
                </li>
            </ul>
        </>
    );
};

const Dashboard = () => (
    <div>
        <h1>Admin dashboard</h1>
        <Link to="/">Home</Link>
    </div>
);

const PostList = () => (
    <div>
        <h1>Posts</h1>
        <Link to="/">Home</Link>
    </div>
);

const PostDetail = () => (
    <div>
        <h1>Post 123</h1>
        <Link to="/">Home</Link>
    </div>
);

export const useRedirect = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/123" element={<PostDetail />} />
    </Routes>
);
