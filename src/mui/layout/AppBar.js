import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import MuiAppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

const AppBar = ({ title, isLoading, onLeftIconButtonTouchTap }) => {
    const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>{title}</Link>;
    const RightElement = isLoading ? <CircularProgress color="#fff" size={30} thickness={2} style={{ margin: 8 }} /> : <span />;
    return <MuiAppBar title={Title} iconElementRight={RightElement} onLeftIconButtonTouchTap={onLeftIconButtonTouchTap} />;
};

AppBar.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onLeftIconButtonTouchTap: PropTypes.func.isRequired,
};

export default pure(AppBar);
