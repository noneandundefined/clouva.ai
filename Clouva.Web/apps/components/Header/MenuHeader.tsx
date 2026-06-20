import i18n from '@/utils/i18n';
import Modal from '../Modal/Modal';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/constants';
import ModalSignOut from '../Modal/ModalSignOut';
import { useModalContext } from '@/context/useModalContext';
import { type UserLoginStateResponse } from '@/rest/userAPI';

interface MenuHeaderProps {
	close: () => void;
	user: UserLoginStateResponse;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ close, user }) => {
	const { t, i18n: i18nInstance } = useTranslation();
	
	const { open } = useModalContext();

	const currentLang = i18nInstance.language?.startsWith('ru') ? 'ru' : 'en';
	const languageLabel = currentLang === 'ru' ? t('label.language-ru') : t('label.language-en');

	const ref = useRef<HTMLDivElement>(null);

	// const initials = user.first_name.slice(0, 2).toUpperCase();
	// const accountType = user.plan_name || t('label.account-type-personal');

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				close();
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [close]);

	const handleLanguageToggle = () => {
		const nextLang = currentLang === 'ru' ? 'en' : 'ru';
		i18n.changeLanguage(nextLang);
		localStorage.setItem('lang', nextLang);
	};

	const handleSignOut = () => {
		close();
		open(
			<Modal title={t('message.sign-out-title')}>
				<ModalSignOut />
			</Modal>
		);
	};

	const isPremium = user.plan_name.toLowerCase() != 'free';

	return (
		<div
			ref={ref}
			className="absolute bg-white border border-[#e5e7eb] left-0 top-10 p-2 rounded-[0.4rem] space-y-2 min-w-[17rem] z-[110]"
			style={{ boxShadow: '0 0 #0000,0 0 #0000,0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)' }}
		>
			<div
				className="flex items-center gap-2 rounded-[10px] cursor-pointer p-2 px-3 hover:bg-[#F9F9F9]"
				style={isPremium ? { color: '#fff', background: 'linear-gradient(135deg, #fc3365 10%, #fc3387 15%, #b25cff 65%, #2c46a8 110%)' } : {}}
			>
				{/* <div className="flex items-center justify-center bg-[#EEF8FF] hover:bg-[#F2FAFF] border border-[#5C8BA9] w-[3rem] h-[3rem] cursor-pointer rounded-full">
                    <p className="text-[1rem] text-[#5C8BA9]">{initials}</p>
                </div> */}

				<div>
					<p className="text-sm font-normal">
						{user.first_name} {user.last_name}
					</p>
					<p className={`text-sm ${isPremium ? 'text-[#fff]' : 'text-[#444]'}`}>{user.email}</p>
				</div>
			</div>

			<div
				className="flex items-center rounded-[10px] cursor-pointer p-2 px-3 hover:bg-[#F9F9F9]"
				onClick={handleLanguageToggle}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => e.key === 'Enter' && handleLanguageToggle()}
			>
				<p className="text-sm">{languageLabel}</p>
			</div>

			<div className="h-[1px] w-full bg-[#EEEEEE]" />

			<Link to={ROUTES.CLOUVA_PRICING} onClick={close} className="flex items-center rounded-[10px] cursor-pointer p-2 px-3 hover:bg-[#F9F9F9]">
				<p className="text-sm">{t('label.settings-upgrade-business')}</p>
			</Link>

			<Link to={ROUTES.CLOUVA_SETTINGs} onClick={close} className="flex items-center rounded-[10px] cursor-pointer p-2 px-3 hover:bg-[#F9F9F9]">
				<p className="text-sm">{t('label.settings-title')}</p>
			</Link>

			<div
				className="flex items-center rounded-[10px] cursor-pointer p-2 px-3 hover:bg-[#F9F9F9]"
				onClick={handleSignOut}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => e.key === 'Enter' && handleSignOut()}
			>
				<p className="text-sm">{t('label.sign-out')}</p>
			</div>
		</div>
	);
};

export default MenuHeader;
