import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Notification from './Notification';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const CrudApp = ({ isLoading, children }) => (
    <MuiThemeProvider>
        <div>
            <AppBar title="Admin on REST" iconElementRight={isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span/>} />
            <div className="body">
                {children}
            </div>
            <Notification />
        </div>
    </MuiThemeProvider>
);

CrudApp.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.node,
};

function mapStateToProps(state) {
    return { isLoading: state.admin.loading > 0 };
}

export default connect(
  mapStateToProps,
)(CrudApp);
