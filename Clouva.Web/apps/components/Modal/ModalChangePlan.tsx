import { useTranslation } from 'react-i18next';
import { basicUserLoginState } from '@/rest/userAPI';
import { useQueryClient } from '@tanstack/react-query';
import GUIButton from '@/components/ui/Button/GUIButton';
import { notify } from '@/components/Notification/notify';
import { useModalContext } from '@/context/useModalContext';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import { basicPaymentAutoRenewUpdate, basicPaymentCheckout } from '@/rest/paymentAPI';

interface ModalChangePlanProps {
	plan: 'free' | 'premium';
	planName: string;
}

const formatDate = (iso: string, locale: string) =>
	new Date(iso).toLocaleDateString(locale.startsWith('ru') ? 'ru-RU' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

const ModalChangePlan: React.FC<ModalChangePlanProps> = ({ plan, planName }) => {
	const { t, i18n } = useTranslation();

	const { close } = useModalContext();

	const queryClient = useQueryClient();

	const { data: respUserLoginState } = useHandleServer(['respUserLoginState'], basicUserLoginState);

	const isPremiumTarget = plan === 'premium';
	const isDowngrade = plan === 'free';

	const currentPlanName = respUserLoginState?.plan_name ?? '';
	const validTo = respUserLoginState?.valid_to;

	const formattedValidTo = validTo ? formatDate(validTo, i18n.language) : null;

	const handleConfirm = async () => {
		if (isPremiumTarget) {
			const { confirmation_url } = await basicPaymentCheckout({ plan_name: planName });

			window.location.assign(confirmation_url);
			return;
		}

		await basicPaymentAutoRenewUpdate({ enabled: false });

		if (formattedValidTo) {
			notify.success(t('message.change-plan-downgrade-success', { date: formattedValidTo }));
		}

		await queryClient.invalidateQueries({ queryKey: ['respUserLoginState'] });
		await queryClient.invalidateQueries({ queryKey: ['respPaymentBilling'] });
		close();
	};

	return (
		<div className="space-y-3 px-1 pb-2">
			<p className="text-sm text-gray-600">{t('message.change-plan-warning', { plan: planName })}</p>

			{isDowngrade && formattedValidTo && (
				<p className="text-sm text-gray-600">
					{t('message.change-plan-downgrade-hint', {
						date: formattedValidTo,
						plan: currentPlanName,
					})}
				</p>
			)}

			{isPremiumTarget && <p className="text-sm text-gray-600">{t('message.change-plan-premium-hint')}</p>}

			<div className="flex flex-col gap-3 md:flex-row">
				<GUIButton className="!h-[40px] !rounded-[8px] !bg-white !text-sm !text-black hover:opacity-80" onClick={close}>
					{t('message.change-plan-cancel')}
				</GUIButton>

				<GUIButton className="!h-[40px] !rounded-[8px] !text-sm" onClick={handleConfirm}>
					{t('message.change-plan-confirm')}
				</GUIButton>
			</div>
		</div>
	);
};

export default ModalChangePlan;
