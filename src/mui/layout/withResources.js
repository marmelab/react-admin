import { connect } from 'react-redux';

const mapStateToProps = state => ({
    resources: Object.keys(state.admin.resources).map(
        key => state.admin.resources[key].props
    ),
});

export default connect(mapStateToProps);
