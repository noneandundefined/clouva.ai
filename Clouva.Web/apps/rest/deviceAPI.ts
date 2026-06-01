import axiosClient from './axios';

const apiPath = '/device';

export interface DeviceAuthSessionResponse {
	created_at: string;
	device_id: string;
	session_id: string;
	confirmed: boolean;
}

export interface DeviceAuthValidResponse {
	valid: boolean;
	message: string;
}

/**
 * Get desktop auth session
 */
export const basicDeviceSessionGetBySessionId = async (sessionId: string): Promise<DeviceAuthValidResponse> => {
	const response = await axiosClient.get(`${apiPath}/session/${sessionId}`, {
		skipErrorHandler: true,
	} as any);
	return response.data.message;
};

/**
 * Confirm desktop request
 */
export const basicDeviceConfirm = async (session_id: string): Promise<DeviceAuthSessionResponse> => {
	const response = await axiosClient.post(`${apiPath}/confirm`, { session_id });
	return response.data.message;
};
