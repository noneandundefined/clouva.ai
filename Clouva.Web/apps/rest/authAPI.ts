import axiosClient from './axios';
import { ROUTES } from '@/constants/constants';
import { notify } from '@/components/Notification/notify';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import type { AuthSigninRequest } from '@/interface/auth/authSigninRequest.interface';
import type { AuthSignupRequest } from '@/interface/auth/authSignupRequest.interface';

const apiPath = '/auth';

type AuthConfirmResponse = {
	status: 'success' | 'invalid' | 'error';
	message: string;
};

export type AuthStatusResponse = {
	status: 'signed_in' | 'sent';
	message: string;
};

/**
 * SignIn user
 */
export const basicAuthSignIn = async (payload: AuthSigninRequest): Promise<AuthStatusResponse> => {
	const response = await axiosClient.post(`${apiPath}/signin`, payload);
	const result = response.data.message as AuthStatusResponse;

	if (result.status === 'signed_in') {
		localStorage.setItem(CACHEKEYs.L_SESSION, result.message);
	}

	return result;
};

/**
 * SignUp user
 */
export const basicAuthSignUp = async (payload: AuthSignupRequest): Promise<void> => {
	await axiosClient.post(`${apiPath}/signup`, payload);
};

/**
 * Check whether email confirmation flow is active for this address
 */
export const basicAuthConfirmPending = async (email: string): Promise<{ pending: boolean }> => {
	const response = await axiosClient.get(`${apiPath}/confirm/pending`, {
		params: { email },
		skipErrorHandler: true,
	} as Parameters<typeof axiosClient.get>[1] & { skipErrorHandler?: boolean });

	return response.data.message;
};

/**
 * Check auth signin/signup user
 */
export type AuthTypeCheck = 'signin' | 'signup';
export const basicAuthCheck = async (email: string): Promise<AuthTypeCheck> => {
	const response = await axiosClient.post(`${apiPath}/check`, { email });
	return response.data.message.status;
};

/**
 * Confirm email user
 */
export const basicAuthConfirmEmail = async (exp: any, sig: any, uuid: any): Promise<AuthConfirmResponse> => {
	const response = await axiosClient.get(`${apiPath}/confirm?exp=${exp}&sig=${sig}&uuid=${uuid}`);
	return response.data.message;
};

/**
 * Sign out user
 */
export const basicAuthSignOut = async (): Promise<void> => {
	const response = await axiosClient.post(`${apiPath}/signout`);
	notify.success(response.data.message);

	window.location.replace(ROUTES.CLOUVA);
};
