import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/constants';
import { basicAuthSignOut } from '@/rest/authAPI';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import { basicUserAccountDelete, basicUserLoginState } from '@/rest/userAPI';

const MoreSetting = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { data: user } = useHandleServer(['respUserLoginState'], basicUserLoginState);

	const [signingOut, setSigningOut] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleSignOut = async () => {
		if (signingOut) return;

		setSigningOut(true);

		try {
			await basicAuthSignOut();
		} finally {
			localStorage.removeItem(CACHEKEYs.L_SESSION);
			setSigningOut(false);

			navigate(ROUTES.HOME);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleting || !user?.can_delete_account) return;

		if (!window.confirm(t('message.delete-account-confirm'))) return;

		setDeleting(true);

		try {
			await basicUserAccountDelete();
			localStorage.removeItem(CACHEKEYs.L_SESSION);
			navigate(ROUTES.HOME);
		} finally {
			setDeleting(false);
		}
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
						disabled={signingOut}
						onClick={handleSignOut}
						className="rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-[5px] text-[14px] text-[#111] transition hover:bg-[#fafafa] disabled:opacity-50"
					>
						{signingOut ? t('message.loading') : t('label.settings-log-out')}
					</button>
				</div>

				{user?.can_delete_account && (
					<div className="flex items-center justify-between pt-3">
						<span className="text-[#c00]">{t('label.settings-delete-account')}</span>

						<button
							type="button"
							disabled={deleting}
							onClick={handleDeleteAccount}
							className="rounded-[8px] border border-[#f0c0c0] bg-white px-3 py-[5px] text-[14px] text-[#c00] transition hover:bg-[#fff5f5] disabled:opacity-50"
						>
							{deleting ? t('message.loading') : t('label.delete')}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MoreSetting;
