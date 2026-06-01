import axiosClient from './axios';
import type { PaymentCheckoutRequest } from '@/interface/payment/paymentCheckoutRequest.interface';

const apiPath = '/payments';

export interface PaymentBillingResponse {
	auto_renew_enabled: boolean;
	has_payment_method: boolean;
	payment_method_type?: string | null;
	payment_method_title?: string | null;
	payment_method_saved_at?: string | null;
}

export interface PaymentHistoryResponse {
	id: number;
	created_at: string;
	plan_name: string;
	amount: number;
	currency: string;
	status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled' | 'failed';
	payment_kind: 'initial' | 'renewal' | 'manual';
	description?: string | null;
	paid_at?: string | null;
}

export interface AutoRenewUpdateRequest {
	enabled: boolean;
}

export interface PaymentCheckoutResponse {
	payment_id: string;
	confirmation_url: string;
}

/**
 * Create YooKassa payment and get redirect URL.
 */
export const basicPaymentCheckout = async (payload: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse> => {
	const response = await axiosClient.post(`${apiPath}/checkout`, payload);
	return response.data.message;
};

/**
 * Billing state: saved payment method and auto-renew (from user_subscriptions).
 */
export const basicPaymentBilling = async (): Promise<PaymentBillingResponse> => {
	const response = await axiosClient.get(`${apiPath}/billing`);
	return response.data.message;
};

/**
 * Payment history list.
 */
export const basicPaymentHistory = async (limit = 50): Promise<PaymentHistoryResponse[]> => {
	const response = await axiosClient.get(`${apiPath}/history`, { params: { limit } });
	return response.data.message;
};

/**
 * Enable or disable subscription auto-renew.
 */
export const basicPaymentAutoRenewUpdate = async (payload: AutoRenewUpdateRequest): Promise<PaymentBillingResponse> => {
	const response = await axiosClient.patch(`${apiPath}/auto-renew`, payload);
	return response.data.message;
};
