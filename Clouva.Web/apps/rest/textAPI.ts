import axiosClient from './axios';

const apiPath = '/text';

/**
 * Rewrite text with AI
 */
export const basicTextRewrite = async (text: string): Promise<string> => {
	const response = await axiosClient.post(`${apiPath}/rewrite`, { text });
	return response.data.message;
};
