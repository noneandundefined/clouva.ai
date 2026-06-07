import axiosClient from './axios';

const apiPath = '/meta';

/**
 * Ack ai models
 */
export const basicMetaAckAiModels = async (): Promise<{ status: number }> => {
	const response = await axiosClient.get(`${apiPath}/ack-ai-models`);
	return response.data.message;
};
