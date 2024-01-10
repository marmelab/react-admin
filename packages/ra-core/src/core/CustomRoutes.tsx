import { ReactNode } from 'react';

/**
 * This component allows you to provide custom routes to the Admin.
 * @param props The component props
 * @param props.children The custom routes.
 * @param props.noLayout A boolean indicating whether to render the routes outside the Layout. Defaults to false.
 * @returns Nothing. This is a configuration component.
 */
export const CustomRoutes = (_props: CustomRoutesProps) => {
    return null;
};

CustomRoutes.raName = 'CustomRoutes';

export type CustomRoutesProps = {
    children: ReactNode;
    noLayout?: boolean;
};
