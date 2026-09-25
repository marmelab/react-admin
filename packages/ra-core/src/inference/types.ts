import { ComponentType } from 'react';

export interface InferredType {
    type?: ComponentType<any>;
    component?: ComponentType<any>;
    representation?: (props: any, children: any) => string;
}

export interface InferredTypeMap {
    [key: string]: InferredType | undefined;
}
