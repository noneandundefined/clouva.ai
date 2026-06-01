import React from 'react';
import { ROUTES } from '@/constants/constants';
import ConfirmEmailPage from './ConfirmEmailPage';
import PageMeta from '@/components/PageMeta/PageMeta';

const IConfirmEmailPage = () => {
	return (
		<React.Fragment>
			<PageMeta page="ConfirmEmail" path={ROUTES.AUTH_CONFIRM_EMAIL} />

			<ConfirmEmailPage />
		</React.Fragment>
	);
};

export default IConfirmEmailPage;
