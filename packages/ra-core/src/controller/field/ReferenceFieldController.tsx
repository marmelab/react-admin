import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import {
    crudGetManyAccumulate as crudGetManyAccumulateAction,
    CrudGetManyAccumulate,
} from '../../actions';
import { linkToRecord } from '../../util';
import { Record } from '../../types';

interface ChildrenFuncParams {
    isLoading: boolean;
    referenceRecord: Record;
    resourceLinkPath: string | boolean;
}

interface Props {
    allowEmpty?: boolean;
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    crudGetManyAccumulate: CrudGetManyAccumulate;
    record?: Record;
    reference: string;
    referenceRecord?: Record;
    resource: string;
    source: string;
    linkType: string | boolean;
}

/**
 * Fetch reference record, and delegate rendering to child component.
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * By default, includes a link to the <Edit> page of the related record
 * (`/users/:userId` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType="show">
 *     <TextField source="name" />
 * </ReferenceField>
 *
 * You can also prevent `<ReferenceField>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceField label="User" source="userId" reference="users" linkType={false}>
 *     <TextField source="name" />
 * </ReferenceField>
 */
export class ReferenceFieldControllerView extends Component<Props> {
    public static defaultProps: Partial<Props> = {
        allowEmpty: false,
        linkType: 'edit',
        referenceRecord: null,
        record: { id: '' },
    };

    componentDidMount() {
        this.fetchReference(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReference(nextProps);
        }
    }

    fetchReference(props) {
        const source = get(props.record, props.source);
        if (source !== null && typeof source !== 'undefined') {
            this.props.crudGetManyAccumulate(props.reference, [source]);
        }
    }

    render() {
        const {
            allowEmpty,
            basePath,
            children,
            linkType,
            record,
            reference,
            referenceRecord,
            resource,
            source,
        } = this.props;
        const rootPath = basePath.replace(resource, reference);
        const resourceLinkPath = !linkType
            ? false
            : linkToRecord(rootPath, get(record, source), linkType as string);

        return children({
            isLoading: !referenceRecord && !allowEmpty,
            referenceRecord,
            resourceLinkPath,
        });
    }
}

const mapStateToProps = (state, props) => ({
    referenceRecord:
        state.admin.resources[props.reference] &&
        state.admin.resources[props.reference].data[
            get(props.record, props.source)
        ],
});

const ReferenceFieldController = connect(
    mapStateToProps,
    {
        crudGetManyAccumulate: crudGetManyAccumulateAction,
    }
)(ReferenceFieldControllerView);

export default ReferenceFieldController;
