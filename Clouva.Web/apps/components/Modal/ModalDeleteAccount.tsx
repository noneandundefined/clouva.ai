import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/constants';
import { basicUserAccountDelete } from '@/rest/userAPI';
import GUIButton from '@/components/ui/Button/GUIButton';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { useModalContext } from '@/context/useModalContext';

const ModalDeleteAccount = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const { close } = useModalContext();

	const handleConfirm = async () => {
		await basicUserAccountDelete();

		localStorage.removeItem(CACHEKEYs.L_SESSION);

		navigate(ROUTES.HOME);
		close();
	};

	return (
		<div className="space-y-3 px-1 pb-2">
			<p className="text-sm text-gray-600">{t('message.delete-account-confirm')}</p>

			<div className="flex flex-col gap-3 md:flex-row">
				<GUIButton className="!h-[40px] !rounded-[8px] !bg-white !text-sm !text-black hover:opacity-80" onClick={close}>
					{t('message.modal-cancel')}
				</GUIButton>

				<GUIButton className="!h-[40px] !rounded-[8px] !text-sm !bg-[#c00] hover:opacity-90" onClick={handleConfirm}>
					{t('label.delete')}
				</GUIButton>
			</div>
		</div>
	);
};

export default ModalDeleteAccount;
