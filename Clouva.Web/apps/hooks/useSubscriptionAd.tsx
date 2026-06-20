import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { useEffect, useState } from 'react';

const SHOW_CHANCE = 0.2;
const SHOW_INTERVAL = 24 * 60 * 60 * 1000;
const CLOSE_DELAY = 5 * 24 * 60 * 60 * 1000;

export const useSubscriptionAd = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const now = Date.now();

		const nextShowAt = Number(localStorage.getItem(CACHEKEYs.SUBSCRIPTION_AD_NEXT_SHOW) || '0');

		if (nextShowAt > now) return;

		const lastShownAt = Number(localStorage.getItem(CACHEKEYs.SUBSCRIPTION_AD_LAST_SHOW) || '0');

		if (now - lastShownAt < SHOW_INTERVAL) return;

		if (Math.random() < SHOW_CHANCE) {
			setIsOpen(true);

			localStorage.setItem(CACHEKEYs.SUBSCRIPTION_AD_LAST_SHOW, now.toString());
		}
	}, []);

	const closeAd = () => {
		const nextShow = Date.now() + CLOSE_DELAY;

		localStorage.setItem(CACHEKEYs.SUBSCRIPTION_AD_NEXT_SHOW, nextShow.toString());

		setIsOpen(false);
	};

	return {
		isOpen,
		closeAd,
		openAd: () => setIsOpen(true),
	};
};
