import * as React from 'react';
import { Link } from 'react-router-dom';
import { useResourceDefinitions } from '../core/useResourceDefinitions';
import { useTranslate } from '../i18n/useTranslate';
import { useRefresh } from '../dataProvider/useRefresh';
import { Notification } from './Notification';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const resources = useResourceDefinitions();
    const translate = useTranslate();
    const refresh = useRefresh();
    return (
        <div style={{ padding: '1em', border: '1px solid #ccc' }}>
            <header>
                <nav
                    style={{
                        display: 'flex',
                        gap: '1em',
                        listStyle: 'none',
                        marginBlockStart: 0,
                        marginBlockEnd: 0,
                        paddingInlineStart: 0,
                        justifyContent: 'space-between',
                    }}
                >
                    <ul
                        style={{
                            display: 'flex',
                            gap: '1em',
                            listStyle: 'none',
                            marginBlockStart: 0,
                            marginBlockEnd: 0,
                            paddingInlineStart: 0,
                        }}
                    >
                        {Object.values(resources).map(resource =>
                            resource.hasList ? (
                                <li key={resource.name}>
                                    <Link to={`/${resource.name}`}>
                                        {`${resource.name
                                            .substring(0, 1)
                                            .toUpperCase()}${resource.name.substring(1)}`}
                                    </Link>
                                </li>
                            ) : null
                        )}
                    </ul>
                    <div
                        style={{
                            display: 'flex',
                            gap: '1em',
                            listStyle: 'none',
                            marginBlockStart: 0,
                            marginBlockEnd: 0,
                            paddingInlineStart: 0,
                        }}
                    >
                        <button onClick={() => refresh()}>
                            {translate('ra.action.refresh')}
                        </button>
                    </div>
                </nav>
            </header>
            <hr />
            <main>{children}</main>
            <Notification />
        </div>
    );
};
