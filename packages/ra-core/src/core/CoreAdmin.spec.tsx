import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { CoreAdmin } from './CoreAdmin';
import { Resource } from './Resource';

describe('CoreAdmin', () => {
    describe('children', () => {
        it('should accept Resources as children', async () => {
            const Foo = () => <div>Foo</div>;
            const App = () => (
                <CoreAdmin>
                    <Resource name="posts" list={Foo} />
                    <Resource name="comments" list={Foo} />
                </CoreAdmin>
            );
            render(<App />);
            await screen.findByText('Foo');
        });
        it('should accept a function returning an array of Resources as children', async () => {
            const Foo = () => <div>Foo</div>;
            const App = () => (
                <CoreAdmin>
                    {() => [
                        <Resource name="posts" key="posts" list={Foo} />,
                        <Resource name="comments" key="comments" list={Foo} />,
                    ]}
                </CoreAdmin>
            );
            render(<App />);
            await screen.findByText('Foo');
        });
        it('should accept a function returning a fragment of Resources as children', async () => {
            const Foo = () => <div>Foo</div>;
            const App = () => (
                <CoreAdmin>
                    {() => (
                        <>
                            <Resource name="posts" list={Foo} />
                            <Resource name="comments" list={Foo} />
                        </>
                    )}
                </CoreAdmin>
            );
            render(<App />);
            await screen.findByText('Foo');
        });
        it('should accept a function returning a promise for an array of Resources as children', async () => {
            const Foo = () => <div>Foo</div>;
            const App = () => (
                <CoreAdmin>
                    {() =>
                        Promise.resolve([
                            <Resource name="posts" key="posts" list={Foo} />,
                            <Resource
                                name="comments"
                                key="comments"
                                list={Foo}
                            />,
                        ])
                    }
                </CoreAdmin>
            );
            render(<App />);
            await screen.findByText('Foo');
        });
        it('should accept a function returning a promise for a fragment of Resources as children', async () => {
            const Foo = () => <div>Foo</div>;
            const App = () => (
                <CoreAdmin>
                    {() =>
                        Promise.resolve(
                            <>
                                <Resource name="posts" list={Foo} />
                                <Resource name="comments" list={Foo} />
                            </>
                        )
                    }
                </CoreAdmin>
            );
            render(<App />);
            await screen.findByText('Foo');
        });
    });
});
