import React from 'react';
import ClouvaPage from './ClouvaPage';
import { ROUTES } from '@/constants/constants';
import PageMeta from '@/components/PageMeta/PageMeta';

const IClouvaPage = () => {
	return (
		<React.Fragment>
			<PageMeta page="Clouva" path={ROUTES.CLOUVA} />

			<ClouvaPage />
		</React.Fragment>
	);
};

export default IClouvaPage;
