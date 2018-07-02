import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crudGetList as crudGetListAction } from 'react-admin'; // eslint-disable-line import/no-unresolved

class CustomRouteNoLayout extends Component {
    componentWillMount() {
        this.props.crudGetList(
            'posts',
            { page: 0, perPage: 10 },
            { field: 'id', order: 'ASC' }
        );
    }

    render() {
        const { total, loaded } = this.props;

        return (
            <div>
                <h1>Posts</h1>
                {!loaded && <p className="app-loader">Loading...</p>}
                {loaded && (
                    <p>
                        Found <span className="total">{total}</span> posts !
                    </p>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loaded:
        state.admin.resources.posts &&
        state.admin.resources.posts.list.total > 0,
    total: state.admin.resources.posts
        ? state.admin.resources.posts.list.total
        : 0,
});

export default connect(
    mapStateToProps,
    { crudGetList: crudGetListAction }
)(CustomRouteNoLayout);
