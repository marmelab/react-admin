import { ComponentType } from 'react';

export interface InferredType {
    type?: ComponentType;
    component?: ComponentType;
    representation?: (props: any, children: any) => string;
}

export interface InferredTypeMap {
    [key: string]: InferredType | undefined;
}
