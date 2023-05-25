import {
    Admin,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
    CardContentInner,
    Button,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

export const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        resources={(permissions: any) => ({
            posts: {
                edit: EditGuesser,
                list: ListGuesser,
                routes: [
                    {
                        path: 'all/*',
                        element: <ListGuesser />,
                    },
                    {
                        path: '*',
                        element: (
                            <CardContentInner>
                                Posts Dashboard
                                <br />
                                <Button
                                    component={Link}
                                    to="all"
                                    label="All posts"
                                />
                            </CardContentInner>
                        ),
                    },
                ],
            },
            comments: {
                list: ListGuesser,
                edit: EditGuesser,
                show: ShowGuesser,
            },
        })}
        customRoutes={(permissions: any) => [
            { path: 'custom', element: <div>Custom route</div> },
        ]}
        customRoutesWithoutLayout={[
            {
                path: 'custom-no-layout',
                element: <div>Custom route no layout</div>,
            },
        ]}
    />
);
