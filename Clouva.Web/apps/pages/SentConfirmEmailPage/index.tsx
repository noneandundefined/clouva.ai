import React from 'react';
import { ROUTES } from '@/constants/constants';
import PageMeta from '@/components/PageMeta/PageMeta';
import SentConfirmEmailPage from './SentConfirmEmailPage';

const ISentConfirmEmailPage = () => {
	return (
		<React.Fragment>
			<PageMeta page="SentConfirmEmail" path={ROUTES.AUTH_SENT_CONFIRM_EMAIL} />

			<SentConfirmEmailPage />
		</React.Fragment>
	);
};

export default ISentConfirmEmailPage;
