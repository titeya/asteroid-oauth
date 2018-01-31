import parse from 'url-parse';

import generateCredentialToken from '../lib/generate-credential-token';
import getOauthState from '../lib/get-oauth-state';
import getOauthClientId from '../lib/get-oauth-client-id';
import getOauthProtocol from '../lib/get-oauth-protocol';

export const name = 'twitter';

export function getOptions({ url, configCollection, scope }) {
	const credentialToken = generateCredentialToken();
	const { protocol, host } = url;
	const query = {
		requestTokenAndRedirect: true,
		state: getOauthState(credentialToken)
	};
	const URL = `//${host}/_oauth/twitter/`;
	const loginUrl = parse(URL).set('query', query).toString();
	return { credentialToken, loginUrl };
}
