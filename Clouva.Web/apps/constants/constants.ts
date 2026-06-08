export const ROUTES = {
	HOME: '/',
	NOT_FOUND: '*',

	CLOUVA: '/clouva',
	CLOUVA_SETTINGs: '/settings',
	CLOUVA_PRICING: '/pricing',

	PAY_STATUS: '/pay',

	AUTH_AUTHORIZE_DEVICE: '/authorize',
	AUTH_CREATE_ACCOUNT: '/create-account',
	AUTH_CONFIRM_EMAIL: '/clouva-confirm-email',
	AUTH_SENT_CONFIRM_EMAIL: '/clouva-sent-confirm-email',
};

type Params = Record<string, string | number>;

export const buildRoute = (route: string, params: Params): string => {
	let result = route;

	Object.entries(params).forEach(([key, value]) => {
		result = result.replace(`:${key}`, encodeURIComponent(String(value)));
	});

	return result;
};
