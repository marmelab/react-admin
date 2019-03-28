import React, {
    Component,
    ReactElement,
    ComponentType,
    HtmlHTMLAttributes,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import {
    MuiThemeProvider,
    createMuiTheme,
    withStyles,
    createStyles,
    WithStyles,
    Theme,
} from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import { StaticContext } from 'react-router';

import defaultTheme from '../defaultTheme';
import Notification from '../layout/Notification';
import DefaultLoginForm from './LoginForm';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
    backgroundImage?: string;
    loginForm: ReactElement<any>;
    theme: object;
    staticContext: StaticContext;
}

const styles = (theme: Theme) =>
    createStyles({
        main: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            height: '1px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        },
        card: {
            minWidth: 300,
            marginTop: '6em',
        },
        avatar: {
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
        },
        icon: {
            backgroundColor: theme.palette.secondary[500],
        },
    });

/**
 * A standalone login page, to serve as authentication gate to the admin
 *
 * Expects the user to enter a login and a password, which will be checked
 * by the `authProvider` using the AUTH_LOGIN verb. Redirects to the root page
 * (/) upon success, otherwise displays an authentication error message.
 *
 * Copy and adapt this component to implement your own login logic
 * (e.g. to authenticate via email or facebook or anything else).
 *
 * @example
 *     import MyLoginPage from './MyLoginPage';
 *     const App = () => (
 *         <Admin loginPage={MyLoginPage} authProvider={authProvider}>
 *             ...
 *        </Admin>
 *     );
 */
class LoginView extends Component<Props & WithStyles<typeof styles>> {
    static propTypes = {
        backgroundImage: PropTypes.string,
        loginForm: PropTypes.element,
        theme: PropTypes.object,
    };

    static defaultProps = {
        backgroundImage: 'https://source.unsplash.com/random/1600x900/daily',
        theme: defaultTheme,
        loginForm: <DefaultLoginForm />,
    };

    theme = createMuiTheme(this.props.theme);
    containerRef = React.createRef<HTMLDivElement>();
    backgroundImageLoaded = false;

    // Even though the React doc ensure the ref creation is done before the
    // componentDidMount, it can happen that the ref is set to null until the
    // next render.
    // So, to handle this case the component will now try to load the image on
    // the componentDidMount, but if the ref doesn't exist, it will try again
    // on the following componentDidUpdate. The try will be done only once.
    // @see https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element
    updateBackgroundImage = () => {
        if (!this.backgroundImageLoaded && this.containerRef.current) {
            const { backgroundImage } = this.props;
            this.containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
            this.backgroundImageLoaded = true;
        }
    };

    // Load background image asynchronously to speed up time to interactive
    lazyLoadBackgroundImage() {
        const { backgroundImage } = this.props;

        if (backgroundImage) {
            const img = new Image();
            img.onload = this.updateBackgroundImage;
            img.src = backgroundImage;
        }
    }

    componentDidMount() {
        this.lazyLoadBackgroundImage();
    }

    componentDidUpdate() {
        if (!this.backgroundImageLoaded) {
            this.lazyLoadBackgroundImage();
        }
    }

    render() {
        const {
            backgroundImage,
            classes,
            className,
            loginForm,
            staticContext,
            ...rest
        } = this.props;

        return (
            <MuiThemeProvider theme={this.theme}>
                <div
                    className={classnames(classes.main, className)}
                    {...rest}
                    ref={this.containerRef}
                >
                    <Card className={classes.card}>
                        <div className={classes.avatar}>
                            <Avatar className={classes.icon}>
                                <LockIcon />
                            </Avatar>
                        </div>
                        {loginForm}
                    </Card>
                    <Notification />
                </div>
            </MuiThemeProvider>
        );
    }
}

const Login = withStyles(styles)(LoginView) as ComponentType<Props>;

export default Login;
