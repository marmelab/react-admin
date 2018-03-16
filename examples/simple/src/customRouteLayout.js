import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crudGetList as crudGetListAction } from 'react-admin'; // eslint-disable-line import/no-unresolved

class CustomRouteLayout extends Component {
    componentWillMount() {
        this.props.crudGetList(
            'posts',
            { page: 0, pageSize: 10 },
            { field: 'id', order: 'ASC' }
        );
    }

    render() {
        const { total } = this.props;

        return (
            <div>
                <h1>Posts</h1>
                <p>
                    Found <span className="total">{total}</span> posts !
                </p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    total: state.admin.resources.posts
        ? state.admin.resources.posts.list.total
        : 0,
});

export default connect(mapStateToProps, { crudGetList: crudGetListAction })(
    CustomRouteLayout
);
