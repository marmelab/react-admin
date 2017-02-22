import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import pure from 'recompose/pure';
import MuiAppBar from 'material-ui/AppBar';

const AppBar = ({ title, onLeftIconButtonTouchTap }) => {
    const Title = <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>{title}</Link>;
    return <MuiAppBar title={Title} onLeftIconButtonTouchTap={onLeftIconButtonTouchTap} />;
};

AppBar.propTypes = {
    title: PropTypes.string.isRequired,
    onLeftIconButtonTouchTap: PropTypes.func.isRequired,
};

export default pure(AppBar);
