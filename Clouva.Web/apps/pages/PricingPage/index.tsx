import React from 'react';
import PricingPage from './PricingPage';
import { ROUTES } from '@/constants/constants';
import PageMeta from '@/components/PageMeta/PageMeta';

const IPricingPage = () => {
	return (
		<React.Fragment>
			<PageMeta page="Pricing" path={ROUTES.CLOUVA_PRICING} />

			<PricingPage />
		</React.Fragment>
	);
};

export default IPricingPage;
