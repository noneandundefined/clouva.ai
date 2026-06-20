import { useTranslation } from 'react-i18next';
import { basicAuthSignOut } from '@/rest/authAPI';
import GUIButton from '@/components/ui/Button/GUIButton';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { useModalContext } from '@/context/useModalContext';

const ModalSignOut = () => {
	const { t } = useTranslation();

	const { close } = useModalContext();

	const handleConfirm = async () => {
		try {
			await basicAuthSignOut();
		} finally {
			localStorage.removeItem(CACHEKEYs.L_SESSION);
			close();
		}
	};

	return (
		<div className="space-y-3 px-1 pb-2">
			<p className="text-sm text-gray-600">{t('message.sign-out-hint')}</p>

			<div className="flex flex-col gap-3 md:flex-row">
				<GUIButton className="!h-[40px] !rounded-[8px] !bg-white !text-sm !text-black hover:opacity-80" onClick={close}>
					{t('message.modal-cancel')}
				</GUIButton>

				<GUIButton className="!h-[40px] !rounded-[8px] !text-sm" onClick={handleConfirm}>
					{t('label.sign-out')}
				</GUIButton>
			</div>
		</div>
	);
};

export default ModalSignOut;
