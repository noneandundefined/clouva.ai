import config from './config';
import { useEffect, useState } from 'react';
import Fallback from '@/components/Fallback';
import { getAuthState } from '@/private-route';
import { ROUTES } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import type { CustomRouteConfig } from './config';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const CustomRoute: React.FC<CustomRouteConfig> = ({ loginRequired = true, redirectIfLogged = false, component: Component, title }) => {
	const { t } = useTranslation();
	const location = useLocation();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		if (title) {
			document.title = `${t(title)} - ${t('label.web-title')}`;
		} else {
			document.title = t('label.web-title');
		}
	}, [title, t]);

	useEffect(() => {
		getAuthState().then((logged) => {
			setIsLoggedIn(logged);
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return <Fallback />;
	}

	if (loginRequired) {
		if (isLoggedIn) {
			return <Component />;
		} else {
			return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
		}
	} else {
		return isLoggedIn && redirectIfLogged ? <Navigate to={ROUTES.HOME} replace /> : <Component />;
	}
};

const AppRouter: React.FC = () => {
	return (
		<Routes>
			{config.map((route) => (
				<Route key={route.path} path={route.path} element={<CustomRoute {...route} />} />
			))}
		</Routes>
	);
};

export default AppRouter;
