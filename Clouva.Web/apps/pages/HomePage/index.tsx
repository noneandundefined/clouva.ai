import React from 'react';
import HomePage from './HomePage';
import { ROUTES } from '@/constants/constants';
import PageMeta from '@/components/PageMeta/PageMeta';

const IHomePage = () => {
	return (
		<React.Fragment>
			<PageMeta page="Home" path={ROUTES.HOME} />

			<HomePage />
		</React.Fragment>
	);
};

export default IHomePage;
