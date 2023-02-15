import expect from 'expect';

import { localStorageStore, getStorage } from './localStorageStore';

describe('localStorageStore', () => {
    it('should allow to store and retrieve a value', () => {
        const store = localStorageStore();
        store.setItem('foo', 'bar');
        expect(store.getItem('foo')).toEqual('bar');
    });
    describe('removeItem', () => {
        it('should remove an item', () => {
            const store = localStorageStore();
            store.setItem('foo', 'bar');
            store.setItem('hello', 'world');
            store.removeItem('foo');
            expect(store.getItem('foo')).toEqual(undefined);
            expect(store.getItem('hello')).toEqual('world');
        });
    });
    describe('removeItems', () => {
        it('should remove all items with the given prefix', () => {
            const store = localStorageStore();
            store.setItem('foo', 'bar');
            store.setItem('foo2', 'bar2');
            store.setItem('foo3', 'bar3');
            store.setItem('hello', 'world');
            store.removeItems('foo');
            expect(store.getItem('foo')).toEqual(undefined);
            expect(store.getItem('foo2')).toEqual(undefined);
            expect(store.getItem('foo3')).toEqual(undefined);
            expect(store.getItem('hello')).toEqual('world');
        });
    });
    describe('reset', () => {
        it('should reset the store', () => {
            const store = localStorageStore();
            store.setItem('foo', 'bar');
            store.reset();
            expect(store.getItem('foo')).toEqual(undefined);
        });
    });
    describe('reset preserving items outside Ra-Store', () => {
        it('should reset the store', () => {
            const store = localStorageStore();
            store.setItem('foo', 'bar');
            getStorage().setItem('baz', 'baz'); //set custom item in localstorage
            store.reset();
            expect(getStorage().getItem('baz')).toEqual('baz'); //expect not to be wiped on store reset
            expect(store.getItem('foo')).toEqual(undefined);
        });
    });
    describe('changing version preserve localStorage items', () => {
        it('should preserve localStorage items', () => {
            const store = localStorageStore('1');
            store.setItem('foo', 'bar');
            getStorage().setItem('baz', 'baz'); //set custom item in localstorage
            //change the localStorageStore version
            //because actually the RA_STORE const is not exported, i search for the string "version" that is actually hardcoded in the keys
            //also providing an actual default
            const storeVersionName =
                Object.getOwnPropertyNames(getStorage()).find(
                    i => i.indexOf('.version') > 0
                ) || 'RaStore.version';
            getStorage().setItem(storeVersionName, '2');
            store.setup();
            expect(getStorage().getItem('baz')).toEqual('baz'); //expect not to be wiped on store reset
            expect(store.getItem('foo')).toEqual(undefined); //deleted during setup
        });
    });
});
