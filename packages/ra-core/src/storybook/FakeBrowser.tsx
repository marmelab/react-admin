import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import {
    createMemoryHistory,
    History,
    Location,
    createPath,
    parsePath,
} from 'history';

/**
 * This is a storybook decorator that wrap the story inside a fake browser.
 * It features an editable address bar with back and forward buttons.
 *
 * @example Usage in a storybook
 * export default {
 *     title: 'ra-core/Admin/CustomRoutes/Authenticated',
 *     decorators: [FakeBrowserDecorator],
 *     parameters: {
 *         // You can pass the react-router history initial entries like this
 *         initialEntries: ['/authenticated'],
 *     },
 * };
 *
 * const MyStory = (args, context) => (
 *     // Don't forget to pass the history to the Admin component so that
 *     // user changes from the fake browser address bar can impact the application
 *     <Admin history={context.history}>
 *     </Admin>
 * );
 */
export const FakeBrowserDecorator = (Story, context) => {
    const history = createMemoryHistory({
        initialEntries: context.parameters.initialEntries,
    });

    return (
        <Browser history={history}>
            <Story history={history} />
        </Browser>
    );
};

const Browser = ({
    children,
    history,
}: {
    children: ReactNode;
    history: History;
}) => {
    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
            <div className="browser">
                <BrowserBar history={history} />
                <div className="browser-container">{children}</div>
            </div>
        </>
    );
};

const BrowserBar = ({ history }: { history: History }) => {
    const [location, setLocation] = useState<Location>(history.location);

    useEffect(() => {
        const unsubscribe = history.listen(update => {
            setLocation(update.location);
        });

        return unsubscribe;
    }, [history]);

    const handleSubmit = event => {
        event.preventDefault();
        const newLocation = parsePath(
            event.target.elements.location.value.replace(
                'http://localhost:3000',
                ''
            )
        );
        history.push(newLocation);
    };

    return (
        <div className="browser-bar">
            <div className="button">
                <button
                    aria-label="Back"
                    onClick={() => {
                        history.back();
                    }}
                >
                    <BackwardIcon />
                </button>
            </div>
            <div className="button">
                <button
                    aria-label="Forward"
                    onClick={() => {
                        history.forward();
                    }}
                >
                    <ForwardIcon />
                </button>
            </div>
            <div className="button">
                <button aria-label="Refresh">
                    <span aria-hidden>
                        <RefreshIcon />
                    </span>
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    name="location"
                    type="text"
                    key={createPath(location)}
                    defaultValue={`http://localhost:3000${createPath(
                        location
                    )}`}
                />
            </form>
        </div>
    );
};

const styles = `
.browser {
    color: black;
    display: flex;
    flex-direction: column;
    margin: 10px;
}
.browser-bar {
    padding: 10px 8px 6px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: 2px solid #ccc;
    background: #ddd;
    display: flex;
    gap: 2px;
}
.browser-bar .button button {
    background: none;
    border: none;
}
.browser-bar .button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 3px;
}
.browser-bar .button:hover {
    background-color: #aaa;
}
.browser-bar svg {
    height: 16px;
    width: 16px;
}

.browser-bar form {
    background-color: white;
    color: #bbb;
    border-radius: 3px;
    border-width: 1px;
    border-style: solid;
    border-color: #d7d3d3;
    font-size: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.browser-bar input {
    border: none;
    border-radius: 3px;
    padding: 3px 7px 4px;
}

.browser-container {
    background-color: #fff;
    height: 350px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}
`;

const BackwardIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
        />
    </svg>
);

const ForwardIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
        />
    </svg>
);

const RefreshIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
    </svg>
);
