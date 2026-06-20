import axiosClient from './axios';

const apiPath = '/text';

/**
 * Rewrite text with AI
 */
export const basicTextRewrite = async (text: string): Promise<string> => {
	const formData = new FormData();

	const file = new Blob([text], { type: 'text/plain' });
	formData.append('file', file, 'input.txt');

	const response = await axiosClient.post(`${apiPath}/rewrite`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data.message;
};
