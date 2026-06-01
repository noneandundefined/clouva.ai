import axiosClient from './axios';
import { toast } from 'react-toastify';
import type { UserMeUpdateRequest } from '@/interface/user/userMeUpdateRequest.interface';

const apiPath = '/users';

export interface UserLoginStateResponse {
	/* User cores */
	id: number;
	created_at: string;
	email: string;
	email_confirmed: boolean;
	first_name: string;
	last_name: string;

	/* User subscriptions */
	plan_name: string;
	valid_to: string | null;
	tokens_used: number;
	tokens_limit: number;
	amount: number;
	currency: string;
	can_change_email: boolean;
	can_delete_account: boolean;
}

export interface UserSessionResponse {
	session_id: string;
	platform: string;
	device_id?: string;
	created_at: string;
	current: boolean;
}

/**
 * Get user login state
 */
export const basicUserLoginState = async (): Promise<UserLoginStateResponse> => {
	const response = await axiosClient.get(`${apiPath}/login-state`);
	return response.data.message;
};

/**
 * List connected devices
 */
export const basicUserSessionsGetList = async (): Promise<UserSessionResponse[]> => {
	const response = await axiosClient.get(`${apiPath}/sessions`);
	return response.data.message;
};

/**
 * Disconnect a device session
 */
export const basicUserSessionsDisconnect = async (sessionId: string): Promise<void> => {
	const response = await axiosClient.post(`${apiPath}/sessions/disconnect`, { session_id: sessionId });
	toast.success(response.data.message);
};

/**
 * Update user profile (first name, last name)
 */
export const basicUserProfileUpdate = async (payload: UserMeUpdateRequest): Promise<void> => {
	const response = await axiosClient.patch(`${apiPath}/me`, payload);
	toast.success(response.data.message);
};

/**
 * Delete user account
 */
export const basicUserAccountDelete = async (): Promise<void> => {
	const response = await axiosClient.delete(`${apiPath}/me`);
	toast.success(response.data.message);
};
