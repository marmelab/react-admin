import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import ActionCheck from 'material-ui/svg-icons/action/check-circle';
import AlertError from 'material-ui/svg-icons/alert/error-outline';
import inflection from 'inflection';
import Title from '../layout/Title';
import { ListButton } from '../button';
import { crudGetOne as crudGetOneAction, crudDelete as crudDeleteAction } from '../../actions/dataActions';

class Delete extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        this.props.crudGetOne(this.props.resource, this.props.id, this.getBasePath());
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(nextProps.resource, nextProps.id, this.getBasePath());
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname.split('/').slice(0, -2).join('/');
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudDelete(this.props.resource, this.props.id, this.getBasePath());
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        const { title, id, data, isLoading, resource } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <ListButton basePath={basePath} />
                </CardActions>
                <CardTitle title={<Title title={title} record={data} defaultTitle={`Delete ${inflection.humanize(inflection.singularize(resource))} #${id}`} />} />
                <form onSubmit={this.handleSubmit}>
                    <CardText>Are you sure ?</CardText>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton
                                type="submit"
                                label="Delete"
                                icon={<ActionCheck />}
                                primary
                                style={{
                                    margin: '10px 24px',
                                    position: 'relative',
                                }}
                            />
                            <RaisedButton
                                label="Cancel"
                                icon={<AlertError />}
                                onClick={this.goBack}
                                style={{
                                    margin: '10px 24px',
                                    position: 'relative',
                                }}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                </form>
            </Card>
        );
    }
}

Delete.propTypes = {
    title: PropTypes.any,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    data: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    crudDelete: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: props.params.id,
        data: state.admin[props.resource].data[props.params.id],
        isLoading: state.admin.loading > 0,
    };
}

export default connect(
    mapStateToProps,
    { crudGetOne: crudGetOneAction, crudDelete: crudDeleteAction },
)(Delete);
