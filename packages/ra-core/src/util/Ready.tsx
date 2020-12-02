import * as React from 'react';
import { useState } from 'react';

const styles = {
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column' as 'column',
        fontFamily: '"Roboto", sans-serif',
    },
    main: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center' as 'center',
        flexDirection: 'column' as 'column',
        background:
            'linear-gradient(135deg, #00023b 0%, #00023b 50%, #313264 100%)',
        color: 'white',
        fontSize: '1.5em',
        fontWeight: 'bold' as 'bold',
    },
    secondary: {
        height: '20vh',
        background: '#e8e8e8',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    link: {
        textAlign: 'center' as 'center',
        width: 150,
        display: 'block',
        textDecoration: 'none',
        color: 'black',
        opacity: 0.7,
    },
    linkHovered: {
        opacity: 1,
    },
    image: {
        width: 50,
    },
    logo: {
        height: 100,
    },
};

const Button = ({ img, label, href }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div>
            <a
                href={href}
                style={
                    hovered
                        ? { ...styles.link, ...styles.linkHovered }
                        : styles.link
                }
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img src={img} alt={label} style={styles.image} />
                <br />
                {label}
            </a>
        </div>
    );
};

export default () =>
    process.env.NODE_ENV === 'production' ? (
        <span />
    ) : (
        <div style={styles.root}>
            <div style={styles.main}>
                <img
                    style={styles.logo}
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTMxIDEzMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTMxIDEzMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMyMjI0NTg7fQoJLnN0MXtmaWxsOiM1MTUzN0Q7fQoJLnN0MntmaWxsOiNBM0E0Qjk7fQoJLnN0M3tmaWxsOiMwMDAyM0I7fQoJLnN0NHtmaWxsOiNGRkZGRkY7fQoJLnN0NXtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KPC9zdHlsZT4KPHRpdGxlPkxvZ29fc29tYnJlX2FpPC90aXRsZT4KPGcgaWQ9IlJlY3RhbmdsZV81NiI+Cgk8Zz4KCQk8cmVjdCB4PSIxOS4xIiB5PSIxOSIgdHJhbnNmb3JtPSJtYXRyaXgoMC41IC0wLjg2NiAwLjg2NiAwLjUgLTIzLjkyMjYgODkuNTQ2KSIgY2xhc3M9InN0MCIgd2lkdGg9IjkyLjkiIGhlaWdodD0iOTIuOSIvPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MywxMzAuM0wwLjgsODIuOUw0OC4yLDAuN2w4Mi4yLDQ3LjVMODMsMTMwLjN6IE0zLjUsODIuMWw3OC43LDQ1LjVsNDUuNS03OC43TDQ5LDMuNEwzLjUsODIuMXoiLz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmVjdGFuZ2xlXzU2LTIiPgoJPGc+CgkJPHJlY3QgeD0iMTkiIHk9IjE5LjEiIHRyYW5zZm9ybT0ibWF0cml4KDAuODY2IC0wLjUgMC41IDAuODY2IC0yMy45Nzc3IDQxLjUyNykiIGNsYXNzPSJzdDAiIHdpZHRoPSI5Mi45IiBoZWlnaHQ9IjkyLjkiLz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNDcuOSwxMzFMMCw0OEw4My4xLDBsNDgsODMuMUw0Ny45LDEzMXogTTQuMSw0OS4xbDQ1LDc3LjlsNzcuOS00NUw4Miw0LjFMNC4xLDQ5LjF6Ii8+Cgk8L2c+CjwvZz4KPGcgaWQ9IlJlY3RhbmdsZV81Ni0zIj4KCTxnPgoJCTxyZWN0IHg9IjE5LjEiIHk9IjE5IiBjbGFzcz0ic3QzIiB3aWR0aD0iOTIuOSIgaGVpZ2h0PSI5Mi45Ii8+CgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTExNC41LDExNC41SDE2LjZWMTYuNWg5Ny45VjExNC41eiBNMjEuNiwxMDkuNWg4Ny45VjIxLjVIMjEuNlYxMDkuNXoiLz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmEiPgoJPGcgY2xhc3M9InN0NSI+CgkJPHBhdGggY2xhc3M9InN0NCIgZD0iTTU5LDg2LjdsLTYuNy0xOS4yaC0xLjJIMzguOXYxOS4yaC01LjZWMzguNWgxOC41YzMuNiwwLDYuMywwLjYsOC4xLDEuOGMxLjgsMS4yLDMsMi44LDMuNSw0LjgKCQkJYzAuNSwyLDAuOCw0LjYsMC44LDcuOGMwLDMuNS0wLjQsNi40LTEuMyw4LjdjLTAuOCwyLjMtMi42LDMuOS01LjMsNC44TDY1LDg2LjdINTl6IE01NS43LDYxLjZjMS4yLTAuNywyLTEuNywyLjQtMwoJCQljMC40LTEuMywwLjYtMy4yLDAuNi01LjZjMC0yLjUtMC4yLTQuMy0wLjUtNS42Yy0wLjMtMS4zLTEuMS0yLjItMi4zLTIuOWMtMS4yLTAuNy0zLTEtNS41LTFIMzguOXYxOS4xSDUwCgkJCUM1Mi41LDYyLjYsNTQuNCw2Mi4zLDU1LjcsNjEuNnoiLz4KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNNzQuMyw4NWMtMS42LTEuNS0yLjUtNC4yLTIuNS04LjJjMC0yLjcsMC4zLTQuOCwwLjktNi4zYzAuNi0xLjUsMS42LTIuNiwzLTMuM2MxLjQtMC43LDMuNC0xLDYtMQoJCQljMS4zLDAsNS4xLDAuMSwxMS40LDAuM3YtMi40YzAtMi45LTAuMi01LTAuNy02LjJjLTAuNS0xLjItMS4zLTItMi42LTIuNGMtMS4yLTAuMy0zLjMtMC41LTYuMy0wLjVjLTEuMywwLTMsMC4xLTQuOSwwLjIKCQkJYy0yLDAuMS0zLjYsMC4zLTQuOCwwLjV2LTQuM2MzLjMtMC43LDcuMS0xLDExLjQtMWMzLjcsMCw2LjUsMC40LDguNCwxLjJjMS44LDAuOCwzLjEsMi4yLDMuOCw0LjFjMC43LDEuOSwxLDQuNywxLDguNHYyMi41aC00LjgKCQkJbC0wLjMtNWgtMC4zYy0wLjgsMi4yLTIuMiwzLjctNC4xLDQuNGMtMS45LDAuNy00LjEsMS4xLTYuNiwxLjFDNzguNiw4Ny4yLDc2LDg2LjUsNzQuMyw4NXogTTg5LjEsODJjMS4yLTAuNCwyLjItMS4yLDIuOC0yLjQKCQkJYzAuOS0xLjgsMS4zLTQuMywxLjMtNy4zdi0yaC0xMGMtMS43LDAtMywwLjItMy44LDAuNWMtMC44LDAuMy0xLjQsMC45LTEuNywxLjhjLTAuMywwLjktMC41LDIuMi0wLjUsNGMwLDEuOCwwLjIsMy4xLDAuNiwzLjkKCQkJYzAuNCwwLjgsMS4xLDEuNCwyLDEuOGMxLDAuMywyLjUsMC41LDQuNSwwLjVDODYuMiw4Mi42LDg3LjgsODIuNCw4OS4xLDgyeiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="
                    alt="react-admin logo"
                />
                <h1>Welcome to React-admin</h1>
                <div>
                    Your application is properly configured.
                    <br />
                    Now you can add a &lt;Resource&gt; as child of
                    &lt;Admin&gt;.
                </div>
            </div>
            <div style={styles.secondary}>
                <Button
                    href="https://marmelab.com/react-admin/Readme.html"
                    img="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyNHB4IgoJIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnIGlkPSJCb3VuZGluZ19Cb3giPgoJPHJlY3QgZmlsbD0ibm9uZSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ii8+CjwvZz4KPGcgaWQ9IkZsYXQiPgoJPGcgaWQ9InVpX3g1Rl9zcGVjX3g1Rl9oZWFkZXJfY29weV8yIj4KCTwvZz4KCTxnPgoJCTxwYXRoIGQ9Ik0yMSw1Yy0xLjExLTAuMzUtMi4zMy0wLjUtMy41LTAuNWMtMS45NSwwLTQuMDUsMC40LTUuNSwxLjVjLTEuNDUtMS4xLTMuNTUtMS41LTUuNS0xLjVTMi40NSw0LjksMSw2djE0LjY1CgkJCWMwLDAuMjUsMC4yNSwwLjUsMC41LDAuNWMwLjEsMCwwLjE1LTAuMDUsMC4yNS0wLjA1QzMuMSwyMC40NSw1LjA1LDIwLDYuNSwyMGMxLjk1LDAsNC4wNSwwLjQsNS41LDEuNWMxLjM1LTAuODUsMy44LTEuNSw1LjUtMS41CgkJCWMxLjY1LDAsMy4zNSwwLjMsNC43NSwxLjA1YzAuMSwwLjA1LDAuMTUsMC4wNSwwLjI1LDAuMDVjMC4yNSwwLDAuNS0wLjI1LDAuNS0wLjVWNkMyMi40LDUuNTUsMjEuNzUsNS4yNSwyMSw1eiBNMywxOC41VjcKCQkJYzEuMS0wLjM1LDIuMy0wLjUsMy41LTAuNWMxLjM0LDAsMy4xMywwLjQxLDQuNSwwLjk5djExLjVDOS42MywxOC40MSw3Ljg0LDE4LDYuNSwxOEM1LjMsMTgsNC4xLDE4LjE1LDMsMTguNXogTTIxLDE4LjUKCQkJYy0xLjEtMC4zNS0yLjMtMC41LTMuNS0wLjVjLTEuMzQsMC0zLjEzLDAuNDEtNC41LDAuOTlWNy40OWMxLjM3LTAuNTksMy4xNi0wLjk5LDQuNS0wLjk5YzEuMiwwLDIuNCwwLjE1LDMuNSwwLjVWMTguNXoiLz4KCQk8cGF0aCBvcGFjaXR5PSIwLjMiIGQ9Ik0xMSw3LjQ5QzkuNjMsNi45MSw3Ljg0LDYuNSw2LjUsNi41QzUuMyw2LjUsNC4xLDYuNjUsMyw3djExLjVDNC4xLDE4LjE1LDUuMywxOCw2LjUsMTgKCQkJYzEuMzQsMCwzLjEzLDAuNDEsNC41LDAuOTlWNy40OXoiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGQ9Ik0xNy41LDEwLjVjMC44OCwwLDEuNzMsMC4wOSwyLjUsMC4yNlY5LjI0QzE5LjIxLDkuMDksMTguMzYsOSwxNy41LDljLTEuMjgsMC0yLjQ2LDAuMTYtMy41LDAuNDd2MS41NwoJCQlDMTQuOTksMTAuNjksMTYuMTgsMTAuNSwxNy41LDEwLjV6Ii8+CgkJPHBhdGggZD0iTTE3LjUsMTMuMTZjMC44OCwwLDEuNzMsMC4wOSwyLjUsMC4yNlYxMS45Yy0wLjc5LTAuMTUtMS42NC0wLjI0LTIuNS0wLjI0Yy0xLjI4LDAtMi40NiwwLjE2LTMuNSwwLjQ3djEuNTcKCQkJQzE0Ljk5LDEzLjM2LDE2LjE4LDEzLjE2LDE3LjUsMTMuMTZ6Ii8+CgkJPHBhdGggZD0iTTE3LjUsMTUuODNjMC44OCwwLDEuNzMsMC4wOSwyLjUsMC4yNnYtMS41MmMtMC43OS0wLjE1LTEuNjQtMC4yNC0yLjUtMC4yNGMtMS4yOCwwLTIuNDYsMC4xNi0zLjUsMC40N3YxLjU3CgkJCUMxNC45OSwxNi4wMiwxNi4xOCwxNS44MywxNy41LDE1LjgzeiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="
                    label="Documentation"
                />
                <Button
                    href="https://github.com/marmelab/react-admin/tree/master/examples"
                    img="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48cGF0aCBkPSJNOS40IDE2LjZMNC44IDEybDQuNi00LjZMOCA2bC02IDYgNiA2IDEuNC0xLjR6bTUuMiAwbDQuNi00LjYtNC42LTQuNkwxNiA2bDYgNi02IDYtMS40LTEuNHoiLz48L3N2Zz4="
                    label="Examples"
                />
                <Button
                    href="https://stackoverflow.com/questions/tagged/react-admin"
                    img="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyNHB4IgoJIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnIGlkPSJCb3VuZGluZ19Cb3giPgoJPHJlY3QgZmlsbD0ibm9uZSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ii8+CjwvZz4KPGcgaWQ9IkZsYXQiPgoJPGcgaWQ9InVpX3g1Rl9zcGVjX3g1Rl9oZWFkZXJfY29weV8yIj4KCTwvZz4KCTxnPgoJCTxjaXJjbGUgb3BhY2l0eT0iMC4zIiBjeD0iOSIgY3k9IjgiIHI9IjIiLz4KCQk8cGF0aCBvcGFjaXR5PSIwLjMiIGQ9Ik05LDE1Yy0yLjcsMC01LjgsMS4yOS02LDIuMDFMMywxOGgxMnYtMUMxNC44LDE2LjI5LDExLjcsMTUsOSwxNXoiLz4KCQk8cGF0aCBkPSJNMTYuNjcsMTMuMTNDMTguMDQsMTQuMDYsMTksMTUuMzIsMTksMTd2M2g0di0zQzIzLDE0LjgyLDE5LjQzLDEzLjUzLDE2LjY3LDEzLjEzeiIvPgoJCTxwYXRoIGQ9Ik0xNSwxMmMyLjIxLDAsNC0xLjc5LDQtNGMwLTIuMjEtMS43OS00LTQtNGMtMC40NywwLTAuOTEsMC4xLTEuMzMsMC4yNEMxNC41LDUuMjcsMTUsNi41OCwxNSw4cy0wLjUsMi43My0xLjMzLDMuNzYKCQkJQzE0LjA5LDExLjksMTQuNTMsMTIsMTUsMTJ6Ii8+CgkJPHBhdGggZD0iTTksMTJjMi4yMSwwLDQtMS43OSw0LTRjMC0yLjIxLTEuNzktNC00LTRTNSw1Ljc5LDUsOEM1LDEwLjIxLDYuNzksMTIsOSwxMnogTTksNmMxLjEsMCwyLDAuOSwyLDJjMCwxLjEtMC45LDItMiwyCgkJCVM3LDkuMSw3LDhDNyw2LjksNy45LDYsOSw2eiIvPgoJCTxwYXRoIGQ9Ik05LDEzYy0yLjY3LDAtOCwxLjM0LTgsNHYzaDE2di0zQzE3LDE0LjM0LDExLjY3LDEzLDksMTN6IE0xNSwxOEgzbDAtMC45OUMzLjIsMTYuMjksNi4zLDE1LDksMTVzNS44LDEuMjksNiwyVjE4eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="
                    label="Community"
                />
            </div>
        </div>
    );
