import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

const App = ({ isLoading, children }) => (
    <MuiThemeProvider>
        <div>
            <AppBar title="React Admin" iconElementRight={isLoading ? <CircularProgress color="#fff" size={0.5} /> : <span/>}/>
            <div className="body">
                {children}
            </div>
        </div>
    </MuiThemeProvider>
);

function mapStateToProps({ loading }) {
    return { isLoading: loading > 0 };
}

export default connect(
  mapStateToProps,
)(App);
