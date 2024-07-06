import express from 'express';
import { Provider } from 'oidc-provider';

const app = express();

const clients = [{
    client_id: 'test_implicit_app',
    grant_types: ['implicit', 'authorization_code'],
    response_types: ['id_token', 'code'],
    redirect_uris: ['https://testapp/signin-oidc'],
    token_endpoint_auth_method: 'none'
},
{
    client_id: 'foo',
    grant_types: ['implicit'],
    response_types: ['id_token'],
    redirect_uris: ['https://jwt.io'], // using jwt.io as redirect_uri to show the ID Token contents
    token_endpoint_auth_method: 'none',
},
{
    client_id: 'test_oauth_app',
    client_secret: 'super_secret',
    grant_types: ['client_credentials'],
    redirect_uris: [],
    response_types: [],
}];

const oidc = new Provider('http://localhost:3000', {
    clients,
    claims: {
        address: ['address'],
        email: ['email', 'email_verified'],
        phone: ['phone_number', 'phone_number_verified'],
        profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
            'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo']
    },
    scopes: ['api1'],
    // features: {
    //     clientCredentials: true,
    //     introspection: true,
    //     sessionManagement: true
    // },
    async findById(ctx, id) {
        return {
            accountId: id,
            async claims() { return { sub: id }; },
        };
    },
    async findAccount(ctx, id) {
        // check if user name is == "test"
        if (id === 'test') {
            return {
                accountId: id,
                async claims() { return { sub: id }; },
            };
        }
        return undefined;
    }
});


oidc.listen(3000, () => {
    console.log('oidc-provider listening on port 3000, check http://localhost:3000/.well-known/openid-configuration');
});
