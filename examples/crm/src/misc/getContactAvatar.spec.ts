/**
 * @jest-environment node
 */

import { Contact } from '../types';
import { getContactAvatar, hash } from './getContactAvatar';

// Mock the hash function
jest.mock('./getContactAvatar', () => ({
    ...jest.requireActual('./getContactAvatar'),
    hash: jest
        .fn()
        .mockResolvedValue(
            'b1e5a85e4b9d701bbf7937dc82d8b05fd80b9467b7ffaaae1b429a368f82ea88'
        ),
}));

it('should return gravatar URL for anthony@marmelab.com', async () => {
    const email = 'anthony@marmelab.com';
    const record: Partial<Contact> = { email };

    const avatarUrl = await getContactAvatar(record);
    const hashedEmail = await hash(email);
    expect(avatarUrl).toBe(
        `https://www.gravatar.com/avatar/${hashedEmail}?d=404`
    );
});

it('should return favicon URL if gravatar does not exist', async () => {
    const email = 'no-gravatar@gravatar.com';
    const record: Partial<Contact> = { email };

    const avatarUrl = await getContactAvatar(record);
    expect(avatarUrl).toBe('https://gravatar.com/favicon.ico');
});

it('should not return favicon URL if not domain not allowed', async () => {
    const email = 'no-gravatar@gmail.com';
    const record: Partial<Contact> = { email };

    const avatarUrl = await getContactAvatar(record);
    expect(avatarUrl).toBeNull();
});

it('should return null if no email is provided', async () => {
    const record: Partial<Contact> = {};

    const avatarUrl = await getContactAvatar(record);
    expect(avatarUrl).toBeNull();
});

it('should return null if email has no gravatar or validate domain', async () => {
    const email = 'anthony@fake-domain-marmelab.com';
    const record: Partial<Contact> = { email };

    const avatarUrl = await getContactAvatar(record);
    expect(avatarUrl).toBeNull();
});
