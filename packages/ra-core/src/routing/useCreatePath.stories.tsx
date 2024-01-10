import * as React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { createHashHistory } from 'history';

import { HistoryRouter } from './HistoryRouter';
import { BasenameContextProvider } from './BasenameContextProvider';
import { useBasename } from './useBasename';
import { useCreatePath } from './useCreatePath';
import { FakeBrowserDecorator } from '../storybook//FakeBrowser';

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
                    <Link
                        to={createPath({
                            resource: 'posts',
                            type: 'list',
                        })}
                    >
                        Post list
                    </Link>
                </li>
                <li>
                    <Link
                        to={createPath({
                            resource: 'posts',
                            type: 'edit',
                            id: 123,
                        })}
                    >
                        Post detail
                    </Link>
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
            <Link to={`${basename}/`}>Home</Link>
        </div>
    );
};

const PostDetail = () => {
    const basename = useBasename();
    return (
        <div>
            <h1>Post 123</h1>
            <Link to={`${basename}/`}>Home</Link>
        </div>
    );
};

export const AtRoot = (props, context) => (
    <HistoryRouter history={context.history || createHashHistory()}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/123" element={<PostDetail />} />
        </Routes>
    </HistoryRouter>
);

export const SubPath = (props, context) => (
    <HistoryRouter history={context.history || createHashHistory()}>
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <h1>Main</h1>
                        <div>
                            <Link to="/admin">Go to admin</Link>
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
    </HistoryRouter>
);
