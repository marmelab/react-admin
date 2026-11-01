import * as React from 'react';
import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';

import { CoreAdminContext } from '../../core/CoreAdminContext';
import { useBlocker } from '../useBlocker';
import { useNavigate } from '../useNavigate';

describe('reactRouterProvider', () => {
    beforeEach(() => {
        window.history.replaceState({}, '', '/#/');
    });

    describe('RouterWrapper', () => {
        it('should rerender the children when the parent rerenders', async () => {
            const App = () => {
                const [name, setName] = useState('John');
                return (
                    <>
                        <button onClick={() => setName('Jane')}>
                            Change name
                        </button>
                        <CoreAdminContext>
                            <Routes>
                                <Route path="/" element={<p>{name}</p>} />
                            </Routes>
                        </CoreAdminContext>
                    </>
                );
            };
            render(<App />);
            await screen.findByText('John');

            fireEvent.click(screen.getByText('Change name'));

            await screen.findByText('Jane');
        });

        it('should take the new basename into account when it changes', async () => {
            const GoToPosts = () => {
                const navigate = useNavigate();
                return (
                    <button onClick={() => navigate('/posts')}>
                        Go to posts
                    </button>
                );
            };
            const App = () => {
                const [basename, setBasename] = useState('/foo');
                return (
                    <>
                        <button
                            onClick={() => {
                                window.location.hash = '#/bar';
                                setBasename('/bar');
                            }}
                        >
                            Move to /bar
                        </button>
                        <CoreAdminContext basename={basename}>
                            <Routes>
                                <Route path="*" element={<GoToPosts />} />
                            </Routes>
                        </CoreAdminContext>
                    </>
                );
            };
            window.location.hash = '#/foo';
            render(<App />);
            fireEvent.click(await screen.findByText('Go to posts'));
            await waitFor(() => {
                expect(window.location.hash).toEqual('#/foo/posts');
            });

            fireEvent.click(screen.getByText('Move to /bar'));

            fireEvent.click(await screen.findByText('Go to posts'));
            await waitFor(() => {
                expect(window.location.hash).toEqual('#/bar/posts');
            });
        });

        it('should not lose the navigation state when the parent rerenders', async () => {
            const BlockingPage = () => {
                const navigate = useNavigate();
                const blocker = useBlocker(true);
                return (
                    <>
                        <button onClick={() => navigate('/next')}>Leave</button>
                        {blocker.state === 'blocked' ? (
                            <p>Unsaved changes</p>
                        ) : null}
                    </>
                );
            };
            const App = () => {
                const [, forceRerender] = useState(0);
                return (
                    <>
                        <button
                            onClick={() => forceRerender(count => count + 1)}
                        >
                            Rerender
                        </button>
                        <CoreAdminContext>
                            <Routes>
                                <Route path="/" element={<BlockingPage />} />
                                <Route
                                    path="/next"
                                    element={<p>Next page</p>}
                                />
                            </Routes>
                        </CoreAdminContext>
                    </>
                );
            };
            render(<App />);
            fireEvent.click(await screen.findByText('Leave'));
            await screen.findByText('Unsaved changes');

            fireEvent.click(screen.getByText('Rerender'));

            await screen.findByText('Unsaved changes');
        });
    });
});
