import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchList } from '../../src/list/data/actions';
import { setSort } from '../../src/list/sort/actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.fetchList = this.fetchList.bind(this);
        this.updateSort = this.updateSort.bind(this);
    }

    componentDidMount() {
        this.props.fetchListAction('/comments');
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.sort.field !== this.props.params.sort.field) {
            this.props.fetchListAction(`/comments?sort=${nextProps.params.sort.field}`)
        }
    }

    fetchList(event) {
        event.stopPropagation();
        this.props.fetchListAction('/comments');
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSortAction('name', 'ASC');
    }

    render() {
        const { params } = this.props;
        return (
            <div>
                <ul>
                    <li><a href="#" onClick={this.updateSort}>Change comment sort</a></li>
                    <li><a href="#" onClick={this.fetchList}>Refresh</a></li>
                </ul>
                <pre>{JSON.stringify(params, null, 2)}</pre>
            </div>
        );
    }
}

App.propTypes = {
    resource: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    fetchListAction: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return { params: state[props.resource].list };
}

export default connect(
  mapStateToProps,
  { fetchListAction: fetchList('comments'), setSortAction: setSort('comments') },
)(App);
