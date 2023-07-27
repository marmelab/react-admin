import React from 'react';

import { useEffect, ComponentType, ReactElement, isValidElement } from 'react';
import { isValidElementType } from 'react-is';

import { Route, Routes, useResolvedPath } from 'react-router-dom';
import {
    useResourceDefinitionContext,
    ResourceDefinition,
    ResourceProps,
    useBasename,
    ResourceContextProvider,
    removeDoubleSlashes,
    CreatePathParams,
} from 'react-admin';

const registerResource = ({
    create,
    edit,
    icon,
    list,
    name,
    options,
    show,
    recordRepresentation,
    hasCreate,
    hasEdit,
    hasShow,
    createPath,
    routeType,
}: ResourceProps) => ({
    name,
    options: options ?? {},
    hasList: !!list,
    hasCreate: !!create || !!hasCreate,
    hasEdit: !!edit || !!hasEdit,
    hasShow: !!show || !!hasShow,
    icon,
    recordRepresentation,
    createPath,
    routeType,
});

export const getElement = (
    ElementOrComponent: ComponentType<any> | ReactElement
) => {
    if (isValidElement(ElementOrComponent)) {
        return ElementOrComponent;
    }

    if (isValidElementType(ElementOrComponent)) {
        return <ElementOrComponent />;
    }

    return <>{null}</>;
};

export function ResourceWithReg(props: ResourceProps) {
    const basename = useBasename();

    const registrationProps = registerResource(props);

    const { create, edit, list, show } = props;

    const resolved = useResolvedPath('');

    const {
        name,
        icon,
        options,
        hasCreate,
        hasEdit,
        hasShow,
        hasList,
        recordRepresentation,
        createPath,
        routeType,
    } = registrationProps;

    const {
        register,
        unregister,
        definitions,
    } = useResourceDefinitionContext();

    const def: ResourceDefinition = definitions[name];

    // register resource if not defined or was registered before in a different root
    useEffect(() => {
        const newDef: ResourceDefinition = {
            name,
            hasList,
            hasCreate,
            hasEdit,
            hasShow,
            icon,
            options,
            recordRepresentation,
            createPath,
            routeType,
        };

        /** path to `list` component */
        const newRoot = createPath
            ? removeDoubleSlashes(createPath({ resource: name, type: 'list' }))
            : removeDoubleSlashes(`${basename}/${name}`);

        if (!def) {
            console.log(
                `ResourceEx: REGISTER "${routeType}" "${name}" at "${newRoot}"`
            );
            register(newDef);
        } else {
            /** path to `list` component computed using current definition */
            const defRoot = def.createPath
                ? removeDoubleSlashes(
                      def.createPath({ resource: name, type: 'list' })
                  )
                : removeDoubleSlashes(`${basename}/${name}`);

            // different paths indicate we are attempting to render an already registered resource inside a different URL;
            // before we can render the resource, we need to unregister the current resource and then register new resource
            if (newRoot !== defRoot || def?.routeType !== routeType) {
                console.log(
                    `ResourceEx: UNREGISTER "${def?.routeType}" "${name}" at "${defRoot}"`
                );
                unregister({ name });
            }
        }
    }, [
        def,
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        icon,
        name,
        options,
        recordRepresentation,
        register,
        unregister,
        createPath,
        routeType,
        basename,
        resolved.pathname,
    ]);

    if (def) {
        if (
            routeType === 'resourceWithParent' ||
            routeType === 'childResource'
        ) {
            return (
                <ResourceContextProvider value={name}>
                    <Routes>
                        {list && routeType === 'resourceWithParent' && (
                            <Route index element={getElement(list)} />
                        )}
                        <Route
                            path={`${name}/*`}
                            element={
                                <>
                                    <div>Child "resource" routes:</div>
                                    <Routes>
                                        {create && (
                                            <>
                                                <Route
                                                    path="create/*"
                                                    element={getElement(create)}
                                                />
                                            </>
                                        )}
                                        {show && (
                                            <Route
                                                path=":id/show/*"
                                                element={getElement(show)}
                                            />
                                        )}
                                        {edit && (
                                            <Route
                                                path=":id/*"
                                                element={getElement(edit)}
                                            />
                                        )}
                                        {list && (
                                            <Route
                                                path="/*"
                                                element={getElement(list)}
                                            />
                                        )}
                                        {props.children}
                                    </Routes>
                                </>
                            }
                        />
                    </Routes>
                </ResourceContextProvider>
            );
        }

        return (
            <ResourceContextProvider value={name}>
                <Routes>
                    {create && (
                        <Route path="create/*" element={getElement(create)} />
                    )}
                    {show && (
                        <Route path=":id/show/*" element={getElement(show)} />
                    )}
                    {edit && <Route path=":id/*" element={getElement(edit)} />}
                    {list && <Route path="/*" element={getElement(list)} />}
                    {props.children}
                </Routes>
            </ResourceContextProvider>
        );
    }

    return null;
}

ResourceWithReg.raName = 'Resource';
ResourceWithReg.registerResource = registerResource;

export const createResourceCbFactory = (
    rootPath: string,
    routeType: ResourceDefinition['routeType']
) => {
    return (params: CreatePathParams): string => {
        const { resource, type, id } = params;

        /** route to list component */
        const listPath =
            routeType === 'childResource'
                ? `${rootPath}/${resource}`
                : rootPath;

        /** used by create, show and edit routes */
        const nestedPath =
            routeType === 'default' ? rootPath : `${rootPath}/${resource}`;

        switch (type) {
            case 'list':
                return removeDoubleSlashes(`${listPath}`);
            case 'create':
                return removeDoubleSlashes(`${nestedPath}/create`);
            case 'edit': {
                if (id == null) {
                    // maybe the id isn't defined yet
                    // instead of throwing an error, fallback to list link
                    return removeDoubleSlashes(`${listPath}`);
                }
                return removeDoubleSlashes(
                    `${nestedPath}/${encodeURIComponent(id)}`
                );
            }
            case 'show': {
                if (id == null) {
                    // maybe the id isn't defined yet
                    // instead of throwing an error, fallback to list link
                    return removeDoubleSlashes(`${listPath}`);
                }
                return removeDoubleSlashes(
                    `${nestedPath}/${encodeURIComponent(id)}/show`
                );
            }
            default:
                return type;
        }
    };
};
