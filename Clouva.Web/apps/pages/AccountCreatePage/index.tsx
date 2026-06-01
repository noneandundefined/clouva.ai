import React from 'react';
import { ROUTES } from '@/constants/constants';
import AccountCreatePage from './AccountCreatePage';
import PageMeta from '@/components/PageMeta/PageMeta';

const IAccountCreatePage = () => {
	return (
		<React.Fragment>
			<PageMeta page="CreateAccount" path={ROUTES.AUTH_CREATE_ACCOUNT} />

			<AccountCreatePage />
		</React.Fragment>
	);
};

export default IAccountCreatePage;
