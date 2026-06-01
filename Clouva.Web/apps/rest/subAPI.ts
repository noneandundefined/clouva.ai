import axiosClient from './axios';

const apiPath = '/subs';

export interface SubscriptionResponse {
	id: number;
	created_at: string;
	plan_name: string;
	amount: number;
	currency: string;
	duration_days: number;
	tokens_used: number;
	description: Record<string, string>;
	features: Record<string, string[]>;
}

/**
 * Get subscriptions
 */
export const basicSubsGet = async (): Promise<SubscriptionResponse[]> => {
	const response = await axiosClient.get(`${apiPath}`);
	return response.data.message;
};
