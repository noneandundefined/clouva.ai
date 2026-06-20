import { CACHEKEYs } from '@/constants/CacheKeys.constants';

export const getRedirectUrl = () => sessionStorage.getItem(CACHEKEYs.REDIRECT_AUTH_DEVICE);

export const setRedirectUrl = (url: string) => sessionStorage.setItem(CACHEKEYs.REDIRECT_AUTH_DEVICE, url);

export const clearRedirectUrl = () => sessionStorage.removeItem(CACHEKEYs.REDIRECT_AUTH_DEVICE);

export const getReturnUrl = getRedirectUrl;
export const setReturnUrl = setRedirectUrl;
export const clearReturnUrl = clearRedirectUrl;
