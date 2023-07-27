import React from 'react';
import { ResourceWithReg, createResourceCbFactory } from './ResourceWithReg';
import posts from './posts';
import comments from './comments';
import { useResolvedPath } from 'react-router-dom';

const t1 = 'default';
const fn_1 = createResourceCbFactory('/tabs/1', t1);

const Info = () => {
    const path = useResolvedPath('');

    return (
        <div>
            This is a <b>"{path.pathname}/*"</b> custom route
        </div>
    );
};

export const Tab1 = () => {
    return (
        <>
            <Info />
            <ResourceWithReg
                {...posts}
                name="posts"
                createPath={fn_1}
                routeType={t1}
            />
        </>
    );
};

const t2 = 'resourceWithParent';
const fn_2 = createResourceCbFactory('/tabs/2', t2);
export const Tab2 = () => {
    return (
        <>
            <Info />
            <ResourceWithReg
                {...posts}
                name="posts"
                createPath={fn_2}
                routeType={t2}
            />
            <ResourceWithReg
                {...comments}
                name="comments"
                createPath={fn_2}
                routeType={t2}
            />
        </>
    );
};
