import React from 'react';
import { ROUTES } from '@/constants/constants';
import PageMeta from '@/components/PageMeta/PageMeta';
import AuthorizeDevicePage from './AuthorizeDevicePage';

const IAuthorizeDevicePage = () => {
	return (
		<React.Fragment>
			<PageMeta page="AuthorizeDevice" path={ROUTES.AUTH_AUTHORIZE_DEVICE} />

			<AuthorizeDevicePage />
		</React.Fragment>
	);
};

export default IAuthorizeDevicePage;
