import React from 'react';
import SettingsPage from './SettingsPage';
import { ROUTES } from '@/constants/constants';
import PageMeta from '@/components/PageMeta/PageMeta';

const ISettingsPage = () => {
	return (
		<React.Fragment>
			<PageMeta page="Settings" path={ROUTES.CLOUVA_SETTINGs} />

			<SettingsPage />
		</React.Fragment>
	);
};

export default ISettingsPage;
