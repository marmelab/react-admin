import convertLegacyDataProvider from './convertLegacyDataProvider';
import DataProviderContext from './DataProviderContext';
import HttpError from './HttpError';
import * as fetchUtils from './fetch';
import Mutation, { MutationProps } from './Mutation';
import Query, { QueryProps } from './Query';
import cacheDataProviderProxy from './cacheDataProviderProxy';
import undoableEventEmitter from './undoableEventEmitter';
import useDataProvider from './useDataProvider';
import useMutation, { UseMutationValue } from './useMutation';
import withDataProvider from './withDataProvider';
import useGetManyReference from './useGetManyReference';
import useUpdateMany from './useUpdateMany';
import useCreate from './useCreate';
import useDelete from './useDelete';
import useDeleteMany from './useDeleteMany';
import useRefreshWhenVisible from './useRefreshWhenVisible';
import useIsAutomaticRefreshEnabled from './useIsAutomaticRefreshEnabled';

export * from './testDataProvider';
export * from './useGetOne';
export * from './useGetList';
export * from './useGetMany';
export * from './useGetManyAggregate';
export * from './useQueryWithStore';
export * from './useQuery';
export * from './useUpdate';

export type { Options } from './fetch';
export type { QueryProps, UseMutationValue, MutationProps };

export {
    cacheDataProviderProxy,
    convertLegacyDataProvider,
    DataProviderContext,
    fetchUtils,
    HttpError,
    Mutation,
    Query,
    undoableEventEmitter,
    useDataProvider,
    useMutation,
    useGetManyReference,
    useUpdateMany,
    useCreate,
    useDelete,
    useDeleteMany,
    useRefreshWhenVisible,
    withDataProvider,
    useIsAutomaticRefreshEnabled,
};
