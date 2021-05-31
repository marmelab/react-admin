import * as React from 'react';
import { useState } from 'react';
import {
    Avatar,
    Card,
    Container,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@material-ui/core';
import {
    createMuiTheme,
    makeStyles,
    ThemeProvider,
    unstable_createMuiStrictModeTheme,
} from '@material-ui/core/styles';
import {
    defaultTheme as RaDefaultTheme,
    RaThemeOptions,
} from 'ra-ui-materialui';
import FolderIcon from '@material-ui/icons/Folder';
import { Application } from './types';
import { NewApplicationForm } from './NewApplicationForm';
import {
    loadApplicationsFromStorage,
    storeApplicationsInStorage,
} from './applicationStorage';

const defaultTheme =
    process.env.NODE_ENV !== 'production'
        ? unstable_createMuiStrictModeTheme(RaDefaultTheme)
        : createMuiTheme(RaDefaultTheme);

export const ApplicationsDashboard = ({
    onApplicationSelected,
    theme = defaultTheme,
}: {
    onApplicationSelected: any;
    theme: RaThemeOptions;
}) => (
    <ThemeProvider theme={createMuiTheme(theme)}>
        <Applications onApplicationSelected={onApplicationSelected} />
    </ThemeProvider>
);

const Applications = ({ onApplicationSelected }) => {
    const classes = useStyles();
    const [applications, setApplications] = useState<Application[]>(() =>
        loadApplicationsFromStorage()
    );

    const handleApplicationCreated = application => {
        setApplications(previous => {
            const newApplications = [...previous, application];
            storeApplicationsInStorage(newApplications);
            return newApplications;
        });
    };

    return (
        <Container component="main" className={classes.main}>
            <img
                className={classes.logo}
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTMxIDEzMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTMxIDEzMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMyMjI0NTg7fQoJLnN0MXtmaWxsOiM1MTUzN0Q7fQoJLnN0MntmaWxsOiNBM0E0Qjk7fQoJLnN0M3tmaWxsOiMwMDAyM0I7fQoJLnN0NHtmaWxsOiNGRkZGRkY7fQoJLnN0NXtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KPC9zdHlsZT4KPHRpdGxlPkxvZ29fc29tYnJlX2FpPC90aXRsZT4KPGcgaWQ9IlJlY3RhbmdsZV81NiI+Cgk8Zz4KCQk8cmVjdCB4PSIxOS4xIiB5PSIxOSIgdHJhbnNmb3JtPSJtYXRyaXgoMC41IC0wLjg2NiAwLjg2NiAwLjUgLTIzLjkyMjYgODkuNTQ2KSIgY2xhc3M9InN0MCIgd2lkdGg9IjkyLjkiIGhlaWdodD0iOTIuOSIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MywxMzAuM0wwLjgsODIuOUw0OC4yLDAuN2w4Mi4yLDQ3LjVMODMsMTMwLjN6IE0zLjUsODIuMWw3OC43LDQ1LjVsNDUuNS03OC43TDQ5LDMuNEwzLjUsODIuMXoiLz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmVjdGFuZ2xlXzU2LTIiPgoJPGc+CgkJPHJlY3QgeD0iMTkiIHk9IjE5LjEiIHRyYW5zZm9ybT0ibWF0cml4KDAuODY2IC0wLjUgMC41IDAuODY2IC0yMy45Nzc3IDQxLjUyNykiIGNsYXNzPSJzdDAiIHdpZHRoPSI5Mi45IiBoZWlnaHQ9IjkyLjkiLz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDcuOSwxMzFMMCw0OEw4My4xLDBsNDgsODMuMUw0Ny45LDEzMXogTTQuMSw0OS4xbDQ1LDc3LjlsNzcuOS00NUw4Miw0LjFMNC4xLDQ5LjF6Ii8+Cgk8L2c+CjwvZz4KPGcgaWQ9IlJlY3RhbmdsZV81Ni0zIj4KCTxnPgoJCTxyZWN0IHg9IjE5LjEiIHk9IjE5IiBjbGFzcz0ic3QzIiB3aWR0aD0iOTIuOSIgaGVpZ2h0PSI5Mi45Ii8+CgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTExNC41LDExNC41SDE2LjZWMTYuNWg5Ny45VjExNC41eiBNMjEuNiwxMDkuNWg4Ny45VjIxLjVIMjEuNlYxMDkuNXoiLz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmEiPgoJPGcgY2xhc3M9InN0NSI+CgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTU5LDg2LjdsLTYuNy0xOS4yaC0xLjJIMzguOXYxOS4yaC01LjZWMzguNWgxOC41YzMuNiwwLDYuMywwLjYsOC4xLDEuOGMxLjgsMS4yLDMsMi44LDMuNSw0LjgKCQkJYzAuNSwyLDAuOCw0LjYsMC44LDcuOGMwLDMuNS0wLjQsNi40LTEuMyw4LjdjLTAuOCwyLjMtMi42LDMuOS01LjMsNC44TDY1LDg2LjdINTl6IE01NS43LDYxLjZjMS4yLTAuNywyLTEuNywyLjQtMwoJCQljMC40LTEuMywwLjYtMy4yLDAuNi01LjZjMC0yLjUtMC4yLTQuMy0wLjUtNS42Yy0wLjMtMS4zLTEuMS0yLjItMi4zLTIuOWMtMS4yLTAuNy0zLTEtNS41LTFIMzguOXYxOS4xSDUwCgkJCUM1Mi41LDYyLjYsNTQuNCw2Mi4zLDU1LjcsNjEuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNNzQuMyw4NWMtMS42LTEuNS0yLjUtNC4yLTIuNS04LjJjMC0yLjcsMC4zLTQuOCwwLjktNi4zYzAuNi0xLjUsMS42LTIuNiwzLTMuM2MxLjQtMC43LDMuNC0xLDYtMQoJCQljMS4zLDAsNS4xLDAuMSwxMS40LDAuM3YtMi40YzAtMi45LTAuMi01LTAuNy02LjJjLTAuNS0xLjItMS4zLTItMi42LTIuNGMtMS4yLTAuMy0zLjMtMC41LTYuMy0wLjVjLTEuMywwLTMsMC4xLTQuOSwwLjIKCQkJYy0yLDAuMS0zLjYsMC4zLTQuOCwwLjV2LTQuM2MzLjMtMC43LDcuMS0xLDExLjQtMWMzLjcsMCw2LjUsMC40LDguNCwxLjJjMS44LDAuOCwzLjEsMi4yLDMuOCw0LjFjMC43LDEuOSwxLDQuNywxLDguNHYyMi41aC00LjgKCQkJbC0wLjMtNWgtMC4zYy0wLjgsMi4yLTIuMiwzLjctNC4xLDQuNGMtMS45LDAuNy00LjEsMS4xLTYuNiwxLjFDNzguNiw4Ny4yLDc2LDg2LjUsNzQuMyw4NXogTTg5LjEsODJjMS4yLTAuNCwyLjItMS4yLDIuOC0yLjQKCQkJYzAuOS0xLjgsMS4zLTQuMywxLjMtNy4zdi0yaC0xMGMtMS43LDAtMywwLjItMy44LDAuNWMtMC44LDAuMy0xLjQsMC45LTEuNywxLjhjLTAuMywwLjktMC41LDIuMi0wLjUsNGMwLDEuOCwwLjIsMy4xLDAuNiwzLjkKCQkJYzAuNCwwLjgsMS4xLDEuNCwyLDEuOGMxLDAuMywyLjUsMC41LDQuNSwwLjVDODYuMiw4Mi42LDg3LjgsODIuNCw4OS4xLDgyeiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="
                alt="react-admin logo"
            />
            <Typography component="h2" variant="h2" className={classes.title}>
                Welcome to React-admin
            </Typography>
            <NewApplicationForm
                applications={applications}
                onApplicationCreated={handleApplicationCreated}
            />
            {applications.length > 0 && (
                <Card className={classes.applications}>
                    <List>
                        {applications.map(application => (
                            <ListItem
                                key={application.name}
                                button
                                onClick={() =>
                                    onApplicationSelected(application)
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={application.name}
                                    secondary={new Date(
                                        application.created_at
                                    ).toLocaleDateString()}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}
        </Container>
    );
};

const useStyles = makeStyles(theme => ({
    main: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        paddingTop: theme.spacing(4),
        flexDirection: 'column',
        background:
            'linear-gradient(135deg, #00023b 0%, #00023b 50%, #313264 100%)',
    },
    title: {
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        textAlign: 'center',
    },
    applications: {
        marginTop: theme.spacing(4),
    },
    logo: {
        height: 100,
    },
}));
