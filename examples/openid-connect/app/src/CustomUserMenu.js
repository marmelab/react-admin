import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crudGetOne, UserMenu } from 'react-admin';

// Custom User Menu
// @see https://marmelab.com/blog/2019/03/07/react-admin-advanced-recipes-user-profile.html
class MyUserMenuView extends Component {
    componentDidMount() {
        this.fetchProfile();
    }

    fetchProfile = () => {
        this.props.crudGetOne(
            'profile',
            'my-profile',
            '/my-profile',
            false
        );
    };

    render() {
        const { crudGetOne, profile, ...props } = this.props;
        console.log('profile', profile)

        const icon = profile && profile.picture ? <img src={profile.picture} width="48" height="48" /> : undefined

        return (
            <UserMenu label={profile ? profile.name : 'Unknown'} icon={icon} {...props} />
        );
    }
}

const mapStateToProps = state => {
    const resource = 'profile';
    const id = 'my-profile';
    const profileState = state.admin.resources[resource];

    return {
        profile: profileState ? profileState.data[id] : null
    };
};

const MyUserMenu = connect(
    mapStateToProps,
    { crudGetOne }
)(MyUserMenuView);
export default MyUserMenu;
