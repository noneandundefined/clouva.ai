import { useEffect, useState } from 'react';
import Modal from './components/Modal/Modal';
import { useLocation } from 'react-router-dom';
import ModalAuth from './components/Modal/ModalAuth';
import { CACHEKEYs } from './constants/CacheKeys.constants';

const EXCLUDED_ROUTES = ['/create-account', '/clouva-confirm-email', '/clouva-sent-confirm-email'];

const GlobalAuthModal = () => {
	const { pathname } = useLocation();

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (EXCLUDED_ROUTES.includes(pathname)) {
			setOpen(false);
			return;
		}

		const lsession = localStorage.getItem(CACHEKEYs.L_SESSION);

		if (!lsession) {
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [pathname]);

	if (!open) return null;

	return (
		<Modal width="450px" onClose={() => setOpen(false)}>
			<ModalAuth onSuccess={() => setOpen(false)} />
		</Modal>
	);
};

export default GlobalAuthModal;
