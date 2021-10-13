import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    cloneElement,
    Children,
    HtmlHTMLAttributes,
    ComponentType,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LinearProgress from '@mui/material/LinearProgress';
import {
    linkToRecord,
    sanitizeListRestProps,
    useListContext,
    useResourceContext,
    Record,
    RecordMap,
    Identifier,
    RecordContextProvider,
    ComponentPropType,
} from 'ra-core';

import { Link } from '../Link';

/**
 * Iterator component to be used to display a list of entities, using a single field
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * By default, it includes a link to the <Edit> page of the related record
 * (`/books/:id` in the previous example).
 *
 * Set the linkType prop to "show" to link to the <Show> page instead.
 *
 * @example
 * <ReferenceManyField reference="books" target="author_id" linkType="show">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 *
 * You can also prevent `<SingleFieldList>` from adding link to children by setting
 * `linkType` to false.
 *
 * @example
 * <ReferenceManyField reference="books" target="author_id" linkType={false}>
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 */
export const SingleFieldList = (props: SingleFieldListProps) => {
    const {
        className,
        children,
        linkType = 'edit',
        component = Root,
        ...rest
    } = props;
    const { ids, data, loaded, basePath } = useListContext(props);
    const resource = useResourceContext(props);

    const Component = component;

    if (loaded === false) {
        return <LinearProgress />;
    }

    return (
        <Component
            className={classnames(SingleFieldListClasses.root, className)}
            {...sanitizeListRestProps(rest)}
        >
            {ids.map(id => {
                const resourceLinkPath = !linkType
                    ? false
                    : linkToRecord(basePath, id, linkType);

                if (resourceLinkPath) {
                    return (
                        <RecordContextProvider value={data[id]} key={id}>
                            <Link
                                className={SingleFieldListClasses.link}
                                key={id}
                                to={resourceLinkPath}
                                onClick={stopPropagation}
                            >
                                {cloneElement(Children.only(children), {
                                    record: data[id],
                                    resource,
                                    basePath,
                                    // Workaround to force ChipField to be clickable
                                    onClick: handleClick,
                                })}
                            </Link>
                        </RecordContextProvider>
                    );
                }

                return (
                    <RecordContextProvider value={data[id]} key={id}>
                        {cloneElement(Children.only(children), {
                            key: id,
                            record: data[id],
                            resource,
                            basePath,
                        })}
                    </RecordContextProvider>
                );
            })}
        </Component>
    );
};

SingleFieldList.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    component: ComponentPropType,
    data: PropTypes.any,
    ids: PropTypes.array,
    // @ts-ignore
    linkType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
};

export interface SingleFieldListProps<RecordType extends Record = Record>
    extends HtmlHTMLAttributes<HTMLDivElement> {
    className?: string;

    component?: string | ComponentType<any>;
    linkType?: string | false;
    children: React.ReactElement;
    // can be injected when using the component without context
    basePath?: string;
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    loaded?: boolean;
}

const PREFIX = 'RaSingleFieldList';

export const SingleFieldListClasses = {
    root: `${PREFIX}-root`,
    link: `${PREFIX}-link`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`& .${SingleFieldListClasses.root}`]: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: -theme.spacing(1),
        marginBottom: -theme.spacing(1),
    },

    [`& .${SingleFieldListClasses.link}`]: {},
}));

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};
