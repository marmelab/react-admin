import React, { Component, PropTypes } from 'react';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Card, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import { cyan500, pinkA200 } from 'material-ui/styles/colors';

import defaultTheme from '../defaultTheme';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cyan500,
    },
    card: {
        minWidth: 300,
    },
    avatar: {
        margin: '1em',
        textAlign: 'center ',
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        display: 'flex',
    },
};

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>
    <TextField
        errorText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />;

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { signInError: false };
    }

    signIn = ({ username, password }) => {
        this.props.signInClient(username, password)
            .then(() => this.props.push(this.props.location.state.nextPathname))
            .catch(e => this.setState({ signInError: e }));
    }

    render() {
        const { handleSubmit, submitting, theme } = this.props;
        const { signInError } = this.state;
        const muiTheme = getMuiTheme(theme);
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.main}>
                    <Card className="sign-in" style={styles.card}>
                        <div style={styles.avatar}>
                            <Avatar backgroundColor={pinkA200} icon={<LockIcon />} size={60} />
                        </div>
                        {signInError && <Snackbar open autoHideDuration={4000} message={signInError.message || signInError || 'Login error'} />}

                        <form onSubmit={handleSubmit(this.signIn)}>
                            <div style={styles.form}>
                                <div style={styles.input} >
                                    <Field
                                        name="username"
                                        component={renderInput}
                                        floatingLabelText="Username"
                                    />
                                </div>
                                <div style={styles.input}>
                                    <Field
                                        name="password"
                                        component={renderInput}
                                        floatingLabelText="Password"
                                        type="password"
                                    />
                                </div>
                            </div>
                            <CardActions>
                                <RaisedButton type="submit" primary disabled={submitting} label="Sign in" fullWidth />
                            </CardActions>
                        </form>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}

SignIn.propTypes = {
    ...propTypes,
    previousRoute: PropTypes.string,
    signInClient: PropTypes.func,
    theme: PropTypes.object.isRequired,
};

SignIn.defaultProps = {
    theme: defaultTheme,
};

const validate = (values) => {
    const errors = {};
    if (!values.username) errors.username = 'Required';
    if (!values.password) errors.password = 'Required';
    return errors;
};

const SignInForm = reduxForm({
    form: 'signIn',
    validate,
})(SignIn);

export default (connect(null, { push: pushAction })(SignInForm));
