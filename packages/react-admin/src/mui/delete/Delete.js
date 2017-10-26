import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import ActionCheck from 'material-ui-icons/CheckCircle';
import AlertError from 'material-ui-icons/ErrorOutline';
import compose from 'recompose/compose';
import inflection from 'inflection';

import Header from '../layout/Header';
import Title from '../layout/Title';
import { ListButton } from '../button';
import {
    crudGetOne as crudGetOneAction,
    crudDelete as crudDeleteAction,
} from '../../actions/dataActions';
import translate from '../../i18n/translate';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit * 2,
    },
});

export class Delete extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        this.props.crudGetOne(
            this.props.resource,
            this.props.id,
            this.getBasePath()
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.props.crudGetOne(
                nextProps.resource,
                nextProps.id,
                this.getBasePath()
            );
        }
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname
            .split('/')
            .slice(0, -2)
            .join('/');
    }

    defaultRedirectRoute() {
        return 'list';
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.crudDelete(
            this.props.resource,
            this.props.id,
            this.props.data,
            this.getBasePath(),
            this.props.redirect
                ? this.props.redirect
                : this.defaultRedirectRoute()
        );
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {
        const {
            classes,
            title,
            id,
            data,
            isLoading,
            resource,
            translate,
        } = this.props;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.delete', {
            name: `${resourceName}`,
            id,
            data,
        });
        const titleElement = data ? (
            <Title title={title} record={data} defaultTitle={defaultTitle} />
        ) : (
            ''
        );

        return (
            <div>
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    <Header
                        title={titleElement}
                        actions={
                            <CardActions style={styles.actions}>
                                <ListButton basePath={basePath} />
                            </CardActions>
                        }
                    />

                    <form onSubmit={this.handleSubmit}>
                        <CardContent>
                            <Typography>
                                {translate('ra.message.are_you_sure')}
                            </Typography>
                        </CardContent>
                        <Toolbar disableGutters={true}>
                            <Button
                                raised
                                type="submit"
                                icon={<ActionCheck />}
                                color="primary"
                                className={classes.button}
                            >
                                {translate('ra.action.delete')}
                            </Button>
                            &nbsp;
                            <Button
                                raised
                                icon={<AlertError />}
                                onClick={this.goBack}
                                className={classes.button}
                            >
                                {translate('ra.action.cancel')}
                            </Button>
                        </Toolbar>
                    </form>
                </Card>
            </div>
        );
    }
}

Delete.propTypes = {
    classes: PropTypes.object,
    crudDelete: PropTypes.func.isRequired,
    crudGetOne: PropTypes.func.isRequired,
    data: PropTypes.object,
    history: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    redirect: PropTypes.string,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return {
        id: decodeURIComponent(props.match.params.id),
        data:
            state.admin.resources[props.resource].data[
                decodeURIComponent(props.match.params.id)
            ],
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(mapStateToProps, {
        crudGetOne: crudGetOneAction,
        crudDelete: crudDeleteAction,
    }),
    withStyles(styles),
    translate
);

export default enhance(Delete);
