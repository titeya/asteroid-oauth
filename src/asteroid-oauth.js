import urlParse from 'url-parse';

import openOauthPopup from './lib/open-oauth-popup';
// TODO implement some other common providers such as facebook and twitter
import * as google from './providers/google';
import * as facebook from './providers/facebook';
import * as twitter from './providers/twitter';

const providers = { google, facebook, twitter };

export function init({ endpoint, platform }) {
	this.subscribe('meteor.loginServiceConfiguration');
	this.oauth = {
		platform,
		url: urlParse(endpoint)
	};
}

export function registerOauthProvider(provider) {
	providers[provider.name] = provider;
}

export function loginWith(providerName, scope) {
	const options = providers[providerName].getOptions({
		url: this.oauth.url,
		// The mixin which implements collections must also implement the
		// getServiceConfig method
		configCollection: this.getServiceConfig(providerName),
		scope
	});
	return openOauthPopup(
		this.oauth.platform,
		this.oauth.url.host,
		options.credentialToken,
		options.loginUrl,
		(oauth) => this.login({ oauth })
	);
}
