import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import {
    EditBase,
    InferredElement,
    useResourceContext,
    useEditContext,
    getElementsFromRecords,
    RaRecord,
} from 'ra-core';
import { capitalize, singularize } from 'inflection';

import { EditProps } from './Edit';
import { EditView } from './EditView';
import { editFieldTypes } from './editFieldTypes';

export const EditGuesser = <RecordType extends RaRecord = any>(
    props: EditGuesserProps<RecordType>
) => {
    const {
        resource,
        id,
        mutationMode,
        mutationOptions,
        queryOptions,
        redirect,
        transform,
        disableAuthentication,
        ...rest
    } = props;
    return (
        <EditBase<RecordType>
            resource={resource}
            id={id}
            mutationMode={mutationMode}
            mutationOptions={mutationOptions}
            queryOptions={queryOptions}
            redirect={redirect}
            transform={transform}
            disableAuthentication={disableAuthentication}
        >
            <EditViewGuesser {...rest} />
        </EditBase>
    );
};

interface EditGuesserProps<RecordType extends RaRecord = any>
    extends Omit<EditProps<RecordType>, 'children'> {}

const EditViewGuesser = <RecordType extends RaRecord = any>(
    props: EditGuesserProps<RecordType>
) => {
    const resource = useResourceContext(props);

    if (!resource) {
        throw new Error(
            `<EditGuesser> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }

    const { record } = useEditContext();
    const [child, setChild] = useState<ReactNode>(null);
    const { enableLog = process.env.NODE_ENV === 'development', ...rest } =
        props;

    useEffect(() => {
        setChild(null);
    }, [resource]);

    useEffect(() => {
        if (record && !child) {
            const inferredElements = getElementsFromRecords(
                [record],
                editFieldTypes
            );
            const inferredChild = new InferredElement(
                editFieldTypes.form,
                null,
                inferredElements
            );
            setChild(inferredChild.getElement());

            if (!enableLog) return;

            const representation = inferredChild.getRepresentation();

            const components = ['Edit']
                .concat(
                    Array.from(
                        new Set(
                            Array.from(representation.matchAll(/<([^/\s>]+)/g))
                                .map(match => match[1])
                                .filter(component => component !== 'span')
                        )
                    )
                )
                .sort();

            // eslint-disable-next-line no-console
            console.log(
                `Guessed Edit:

import { ${components.join(', ')} } from 'react-admin';

export const ${capitalize(singularize(resource))}Edit = () => (
    <Edit>
${representation}
    </Edit>
);`
            );
        }
    }, [record, child, resource, enableLog]);

    return <EditView {...rest}>{child}</EditView>;
};
