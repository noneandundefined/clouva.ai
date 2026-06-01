import { CACHEKEYs } from './constants/CacheKeys.constants';

export async function getAuthState() {
	const session = localStorage.getItem(CACHEKEYs.L_SESSION);
	if (session !== null) {
		return true;
	}

	return false;
}
