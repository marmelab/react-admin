const phin = require('phin');

const issuer = 'https://accounts.google.com/';
const { OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_REDIRECT_URI } = process.env;

const urlEncode = body =>
    Object.entries(body)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.send();
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    if (!req.body.code) {
        res.status(400).json({ error: 'Param `code` is missing' });
        return;
    }

    if (!req.body.code_verifier) {
        res.status(400).json({ error: 'Param `code_verifier` is missing' });
        return;
    }

    const { code, code_verifier } = req.body;

    const { body: openidConfiguration } = await phin({
        url: `${issuer}/.well-known/openid-configuration`,
        parse: 'json',
    });
    const { token_endpoint } = openidConfiguration;

    const { body: token } = await phin({
        method: 'POST',
        url: token_endpoint,
        parse: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: urlEncode({
            client_id: OIDC_CLIENT_ID,
            client_secret: OIDC_CLIENT_SECRET,
            redirect_uri: OIDC_REDIRECT_URI,
            code,
            code_verifier,
            grant_type: 'authorization_code',
        }),
    });

    if (token.error) {
        res.status(400);
    }

    res.json(token);
};
