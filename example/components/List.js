import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { queryParameters } from '../../src/list/util/fetch';
import { fetchList } from '../../src/list/data/actions';
import { setSort } from '../../src/list/sort/actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.updateSort = this.updateSort.bind(this);
    }

    componentDidMount() {
        this.props.fetchListAction(this.props.resource, this.getPath(this.props.params));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.sort.field !== this.props.params.sort.field
         || nextProps.params.sort.order !== this.props.params.sort.order
         || nextProps.params.sort.filter !== this.props.params.sort.filter) {
            this.props.fetchListAction(this.props.resource, this.getPath(nextProps.params));
        }
    }

    getPath(params) {
        const query = {
            _sortField: params.sort.field,
            _sortDir: params.sort.order,
        };
        if (params.filter) {
            query._filter = params.filter;
        }
        return `${this.props.path}?${queryParameters(query)}`;
    }

    refresh(event) {
        event.stopPropagation();
        this.props.fetchListAction(this.props.resource, this.getPath(this.props.params));
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSortAction(this.props.resource, event.currentTarget.dataset.sort);
    }

    render() {
        const { params } = this.props;
        return (
            <div>
                <ul>
                    <li><a href="#" onClick={this.updateSort} data-sort="id">sortById</a></li>
                    <li><a href="#" onClick={this.updateSort} data-sort="name">sortByName</a></li>
                    <li><a href="#" onClick={this.refresh}>Refresh</a></li>
                </ul>
                <pre>{JSON.stringify(params, null, 2)}</pre>
            </div>
        );
    }
}

App.propTypes = {
    resource: PropTypes.string.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    fetchListAction: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return { params: state[props.resource].list };
}

export default connect(
  mapStateToProps,
  { fetchListAction: fetchList, setSortAction: setSort },
)(App);
