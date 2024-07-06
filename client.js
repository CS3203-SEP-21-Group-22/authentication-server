import { Issuer } from 'openid-client';

async function authenticate() {
  try {
    const issuer = await Issuer.discover('http://localhost:3000'); // Discover the OIDC configuration
    // const client = new issuer.Client({
    //   client_id: 'test_implicit_app',
    //   client_secret: 'implicit',
    //   redirect_uris: ['https://testapp/signin-oidc'],
    //   response_types: ['code'],
    // });
    const client = new issuer.Client({
        client_id: 'foo',
        client_secret: 'implicit',
        redirect_uris: ['https://jwt.io'],
        response_types: ['id_token'],
    });

    const authUrl = client.authorizationUrl({
      scope: 'openid email profile',
    });

    console.log('Visit this URL to authenticate:', authUrl);
    // Redirect the user to `authUrl` for authentication

    // After redirecting back to your callback URL, handle the token exchange
    // const params = client.callbackParams(req);
    // const tokenSet = await client.callback('http://localhost:3000/callback', params);
    // console.log('Received tokens:', tokenSet);
  } catch (error) {
    console.error('Error during authentication:', error.message);
  }
}

authenticate();
