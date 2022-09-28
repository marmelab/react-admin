import { getKeycloakHeaders } from './httpClient';

describe('getKeycloakHeaders', () => {
    it('should return the headers needed to authenticate keycloak user', () => {
        const expected = new Headers({
            Accept: 'application/json',
            Authorization: 'Bearer KeycloakToken',
        });

        const extraHeaders = getKeycloakHeaders('KeycloakToken', {});

        expect(extraHeaders).toEqual(expected);
    });

    it('should not add specific header when token is not defined', () => {
        const expected = new Headers({
            Accept: 'application/json',
        });

        const extraHeaders = getKeycloakHeaders(null, {});

        expect(extraHeaders).toEqual(expected);
    });
});
