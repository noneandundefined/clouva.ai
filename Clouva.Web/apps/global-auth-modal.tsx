import { useEffect, useState } from 'react';
import Modal from './components/Modal/Modal';
import { useLocation } from 'react-router-dom';
import { ROUTES } from './constants/constants';
import ModalAuth from './components/Modal/ModalAuth';
import { CACHEKEYs } from './constants/CacheKeys.constants';

const PUBLIC_ROUTES = new Set<string>([
	ROUTES.HOME,
	ROUTES.CLOUVA,
	ROUTES.AUTH_CREATE_ACCOUNT,
	ROUTES.AUTH_CONFIRM_EMAIL,
	ROUTES.AUTH_SENT_CONFIRM_EMAIL,
	ROUTES.AUTH_AUTHORIZE_DEVICE,
]);

const GlobalAuthModal = () => {
	const { pathname } = useLocation();

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (PUBLIC_ROUTES.has(pathname)) {
			setOpen(false);
			return;
		}

		const lsession = localStorage.getItem(CACHEKEYs.L_SESSION);

		setOpen(!lsession);
	}, [pathname]);

	if (!open) return null;

	return (
		<Modal width="450px" onClose={() => setOpen(false)}>
			<ModalAuth onSuccess={() => setOpen(false)} />
		</Modal>
	);
};

export default GlobalAuthModal;
