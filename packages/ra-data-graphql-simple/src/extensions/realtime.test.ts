import { print } from 'graphql';

import buildDataProvider from '../';
import { DataProviderExtensions } from './index';
import { topicToGQLSubscribe, SUBSCRIBE_LIST, SUBSCRIBE_ONE } from './realtime';

describe('Realtime Data Provider Extension', () => {
    const resource: any = { name: 'Command' };

    it('correctly defines methodFactory', async () => {
        const dataProvider = await buildDataProvider({
            clientOptions: { uri: 'http://localhost:4000' },
        });
        expect(
            DataProviderExtensions.Realtime.methodFactory(dataProvider)
                .subscribe
        ).toBeDefined();
        expect(
            DataProviderExtensions.Realtime.methodFactory(dataProvider)
                .unsubscribe
        ).toBeDefined();
    });

    it('correctly defines introspectionOperationNames', async () => {
        expect(
            DataProviderExtensions.Realtime.introspectionOperationNames?.[
                SUBSCRIBE_LIST
            ]
        ).toBeDefined();
        expect(
            DataProviderExtensions.Realtime.introspectionOperationNames?.[
                SUBSCRIBE_ONE
            ]
        ).toBeDefined();

        expect(
            DataProviderExtensions.Realtime.introspectionOperationNames?.[
                SUBSCRIBE_LIST
            ](resource)
        ).toBe('allCommands');
        expect(
            DataProviderExtensions.Realtime.introspectionOperationNames?.[
                SUBSCRIBE_ONE
            ](resource)
        ).toBe('Command');
    });

    describe('topicToGQLSubscribe', () => {
        it('correctly converts a subscribe list topic to a GQL subscribe query', async () => {
            const { query, variables, queryName } = topicToGQLSubscribe(
                'resource/Command'
            );
            expect(variables).toEqual({});
            expect(queryName).toBe('allCommands');
            expect(print(query)).toEqual(
                `subscription allCommands {
  allCommands {
    topic
    event
  }
}
`
            );
        });

        it('correctly converts a subscribe one topic to a GQL subscribe query', async () => {
            const { query, variables, queryName } = topicToGQLSubscribe(
                'resource/Command/1'
            );
            expect(variables).toEqual({ id: '1' });
            expect(queryName).toBe('Command');
            expect(print(query)).toEqual(
                `subscription Command($id: ID!) {
  Command(id: $id) {
    topic
    event
  }
}
`
            );
        });
    });

    describe('subscription management', () => {
        it('correctly subscribes to multiple topics', async () => {
            const subscriptionStore: any[] = [];
            const dataProvider = await buildDataProvider({
                clientOptions: { uri: 'http://localhost:4000' },
                extensions: [
                    {
                        ...DataProviderExtensions.Realtime,
                        factoryArgs: [subscriptionStore],
                    },
                ],
            });

            const topic1 = 'resource/Command';
            const callback1 = () => {};
            const topic2 = 'resource/Command/1';
            const callback2 = () => {};

            await dataProvider.subscribe(topic1, callback1);
            await dataProvider.subscribe(topic2, callback2);

            expect(subscriptionStore).toHaveLength(2);

            expect(subscriptionStore[0].topic).toBe(topic1);
            expect(subscriptionStore[0].subscription).toBeDefined();
            expect(subscriptionStore[0].subscriptionCallback).toBe(callback1);

            expect(subscriptionStore[1].topic).toBe(topic2);
            expect(subscriptionStore[1].subscription).toBeDefined();
            expect(subscriptionStore[1].subscriptionCallback).toBe(callback2);
        });

        it('correctly unsubscribes from a topic', async () => {
            const subscriptionStore: any[] = [];
            const dataProvider = await buildDataProvider({
                clientOptions: { uri: 'http://localhost:4000' },
                extensions: [
                    {
                        ...DataProviderExtensions.Realtime,
                        factoryArgs: [subscriptionStore],
                    },
                ],
            });

            const callback1 = () => {};
            const callback2 = () => {};
            const callback3 = () => {};
            const callback4 = () => {};

            const subscriptions = [
                ['resource/Command', callback1],
                ['resource/Command/1', callback2],
                ['resource/Command/1', callback3],
                ['resource/Command/2', callback4],
            ];

            subscriptions.forEach(
                async s => await dataProvider.subscribe(...s)
            );

            expect(subscriptionStore).toHaveLength(4);

            while (subscriptions.length) {
                const randomI = Math.floor(
                    Math.random() * subscriptions.length
                );
                const subscription = subscriptions.splice(randomI, 1)[0];

                await dataProvider.unsubscribe(...subscription);

                expect(subscriptionStore).toHaveLength(subscriptions.length);

                subscriptions.forEach(([topic, callback]) => {
                    const subscription = subscriptionStore.find(
                        s =>
                            s.topic === topic &&
                            s.subscriptionCallback === callback
                    );

                    expect(subscription).toBeDefined();
                    expect(subscription.topic).toBe(topic);
                    expect(subscription.subscriptionCallback).toBe(callback);
                });
            }
        });
    });
});
