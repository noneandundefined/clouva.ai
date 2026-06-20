import Modal from '@/components/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { basicUserLoginState } from '@/rest/userAPI';
import ModalSignOut from '@/components/Modal/ModalSignOut';
import { useModalContext } from '@/context/useModalContext';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import ModalDeleteAccount from '@/components/Modal/ModalDeleteAccount';

const MoreSetting = () => {
	const { t } = useTranslation();
	const { open } = useModalContext();

	const { data: user } = useHandleServer(['respUserLoginState'], basicUserLoginState);

	const handleOpenSignOut = () => {
		open(
			<Modal title={t('message.sign-out-title')}>
				<ModalSignOut />
			</Modal>
		);
	};

	const handleOpenDeleteAccount = () => {
		if (!user?.can_delete_account) return;

		open(
			<Modal title={t('message.delete-account-title')}>
				<ModalDeleteAccount />
			</Modal>
		);
	};

	return (
		<div className="space-y-2">
			<div>
				<h2 className="text-md md:text-lg font-semibold">{t('label.settings-more')}</h2>
				<p className="text-sm text-gray-500">{t('label.settings-more-hint')}</p>
			</div>

			<div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
				<div className="flex items-center justify-between border-b border-[#efefef] pb-3">
					<span>{t('label.settings-log-out')}</span>

					<button
						type="button"
						onClick={handleOpenSignOut}
						className="rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-[5px] text-[14px] text-[#111] transition hover:bg-[#fafafa]"
					>
						{t('label.settings-log-out')}
					</button>
				</div>

				{user?.can_delete_account && (
					<div className="flex items-center justify-between pt-3">
						<span className="text-[#c00]">{t('label.settings-delete-account')}</span>

						<button
							type="button"
							onClick={handleOpenDeleteAccount}
							className="rounded-[8px] border border-[#f0c0c0] bg-white px-3 py-[5px] text-[14px] text-[#c00] transition hover:bg-[#fff5f5]"
						>
							{t('label.delete')}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MoreSetting;
