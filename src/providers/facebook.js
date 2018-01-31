import parse from 'url-parse';

import generateCredentialToken from '../lib/generate-credential-token';
import getOauthState from '../lib/get-oauth-state';
import getOauthClientId from '../lib/get-oauth-client-id';
import getOauthProtocol from '../lib/get-oauth-protocol';

export const name = 'facebook';

export function getOptions({ url, configCollection, scope }) {
	const credentialToken = generateCredentialToken();
	const { protocol, host } = url;
	const query = {
		client_id: getOauthClientId(configCollection),
		redirect_uri: getOauthProtocol(protocol) + `//${host}/_oauth/facebook`,
		state: getOauthState(credentialToken),
		scope: scope || 'email'
	};
	const loginUrl = parse('https://www.facebook.com/v2.3/dialog/oauth').set('query', query).toString();
	return { credentialToken, loginUrl };
}
