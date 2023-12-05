import { OperationVariables, SubscriptionOptions, gql } from '@apollo/client';

import pluralize from 'pluralize';

import { DataProviderExtension } from '.';
import { DataProvider } from 'ra-core';

// Below is based off @react-admin/ra-realtime expectations

export const SUBSCRIBE_LIST = 'SUBSCRIBE_LIST';
export const SUBSCRIBE_ONE = 'SUBSCRIBE_ONE';

const resourceToSubscribeList = (resource: string) =>
    `all${pluralize(resource)}`;
const resourceToSubscribeOne = (resource: string) => resource;

const introspectionOperationNames = {
    [SUBSCRIBE_LIST]: resource => resourceToSubscribeList(resource.name),
    [SUBSCRIBE_ONE]: resource => resourceToSubscribeOne(resource.name),
};

export const topicToGQLSubscribe = (
    topic: string
): SubscriptionOptions<OperationVariables, any> & { queryName: string } => {
    // Two possible topic patterns (from react admin)
    //    1. resource/${resource}
    //    2. resource/${resource}/${id}

    let raCRUDTopic = topic.startsWith('resource/') ? topic.split('/') : null;

    // TODO handle non crud topics
    if (!raCRUDTopic) return { query: gql``, queryName: '', variables: {} };

    let query;
    let variables = {};
    let queryName;
    const resource = raCRUDTopic[1];

    if (raCRUDTopic.length === 2) {
        // list subscription

        queryName = resourceToSubscribeList(resource);

        query = gql`
      subscription ${queryName} {
        ${queryName}{
          topic
          event
        }
      }
    `;
    } else {
        // single resource subscription
        queryName = resourceToSubscribeOne(resource);

        query = gql`
      subscription ${queryName}($id: ID!) {
        ${queryName}(id: $id){
          topic
          event
        }
      }
    `;

        variables = { id: raCRUDTopic[2] };
    }

    return {
        query,
        variables,
        queryName,
    };
};

type Subscription = {
    topic: string;
    subscription: any;
    subscriptionCallback: any;
};

const methodFactory = (
    dataProvider: DataProvider,
    subscriptionStore: Subscription[] = []
) => {
    return {
        subscribe: async (topic: string, subscriptionCallback: any) => {
            const { queryName, ...subscribeOptions } = topicToGQLSubscribe(
                topic
            );
            const subscription = dataProvider.client
                .subscribe(subscribeOptions)
                .subscribe(data =>
                    subscriptionCallback(data.data[queryName].event)
                );

            subscriptionStore.push({
                topic,
                subscription,
                subscriptionCallback,
            });

            return { data: subscriptionStore };
        },

        unsubscribe: async (topic: string, subscriptionCallback: any) => {
            const indexOfSubscription = subscriptionStore.findIndex(
                s =>
                    s.topic === topic &&
                    s.subscriptionCallback === subscriptionCallback
            );
            const { subscription } = subscriptionStore.splice(
                indexOfSubscription,
                1
            )[0];

            if (subscription) subscription.unsubscribe();

            return { data: subscriptionStore };
        },
    };
};

export const RealtimeExtension: DataProviderExtension = {
    methodFactory,
    introspectionOperationNames,
};
