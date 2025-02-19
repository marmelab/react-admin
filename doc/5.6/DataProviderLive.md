---
layout: default
title: "Real-Time Updates And Locks"
---

# Real-Time Updates And Locks

Teams where several people work in parallel on a common task need to allow live updates, real-time notifications, and prevent data loss when two editors work on the same resource concurrently. 

<video controls autoplay playsinline muted>
  <source src="./img/CollaborativeDemo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

React-admin offers powerful realtime features to help you build collaborative applications, based on the Publish / Subscribe (PubSub) pattern. The [Realtime documentation](./Realtime.md) explains how to use them.

These features are part of the [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" />.

## Realtime Data Provider

The realtime features are backend agnostic. Just like for CRUD operations,realtime operations rely on the data provider, using additional methods:

- `dataProvider.subscribe(topic, callback)`
- `dataProvider.unsubscribe(topic, callback)`
- `dataProvider.publish(topic, event)` (optional - publication is often done server-side)

In addition, to support the lock features, the `dataProvider` must implement 4 more methods:

- `dataProvider.lock(resource, { id, identity, meta })`
- `dataProvider.unlock(resource, { id, identity, meta })`
- `dataProvider.getLock(resource, { id, meta })`
- `dataProvider.getLocks(resource, { meta })`

You can implement these features using any realtime backend, including:

- [Mercure](https://mercure.rocks/),
- [API Platform](https://api-platform.com/docs/admin/real-time-mercure/#real-time-updates-with-mercure),
- [supabase](https://supabase.com/),
- [Socket.IO](https://socket.io/),
- [Ably](https://ably.com/),
- and many more.

Check the [Realtime Data Provider documentation](./RealtimeDataProvider.md) for more information, and for helpers to build your own realtime data provider.

## Realtime Hooks And Components

Once your data provider has enabled realtime features, you can use these hooks and components to build realtime applications:

- [`usePublish`](./usePublish.md)
- [`useSubscribe`](./useSubscribe.md)
- [`useSubscribeCallback`](./useSubscribeCallback.md)
- [`useSubscribeToRecord`](./useSubscribeToRecord.md)
- [`useSubscribeToRecordList`](./useSubscribeToRecordList.md)
- [`useLock`](./useLock.md)
- [`useUnlock`](./useUnlock.md)
- [`useGetLock`](./useGetLock.md)
- [`useGetLockLive`](./useGetLockLive.md)
- [`useGetLocks`](./useGetLocks.md)
- [`useGetLocksLive`](./useGetLocksLive.md)
- [`useLockOnMount`](./useLockOnMount.md)
- [`useLockOnCall`](./useLockOnCall.md)
- [`useGetListLive`](./useGetListLive.md)
- [`useGetOneLive`](./useGetOneLive.md)
- [`<ListLive>`](./ListLive.md)
- [`<EditLive>`](./EditLive.md)
- [`<ShowLive>`](./ShowLive.md)
- [`<MenuLive>`](./MenuLive.md)

Refer to the [Realtime documentation](./Realtime.md) for more information.