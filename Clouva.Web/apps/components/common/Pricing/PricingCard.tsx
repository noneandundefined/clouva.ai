import Check from '@/components/@icons/check';
import { useTranslation } from 'react-i18next';
import { basicUserLoginState } from '@/rest/userAPI';
import { basicPaymentCheckout } from '@/rest/paymentAPI';
import GUIButton from '@/components/ui/Button/GUIButton';
import type { SubscriptionResponse } from '@/rest/subAPI';
import { useHandleServer } from '@/hooks/Server/useHandleServer';

interface PricingCardProps {
	sub: SubscriptionResponse;
}

const PricingCard: React.FC<PricingCardProps> = ({ sub }) => {
	const { t, i18n } = useTranslation();

	const { data: respUserLoginState } = useHandleServer(['respUserLoginState'], basicUserLoginState);

	const isCurrentPlan = respUserLoginState?.plan_name.toLowerCase() === sub.plan_name.toLowerCase();
	const isFreePlan = sub.amount <= 0;

	const canCheckout = !isCurrentPlan && !isFreePlan;

	const langKey = i18n.language.startsWith('ru') ? 'ru' : 'en';

	const isPremium = sub.plan_name.toLowerCase() != 'free';

	const handleCheckout = async () => {
		const { confirmation_url } = await basicPaymentCheckout({ plan_name: sub.plan_name });
		window.location.assign(confirmation_url);
	};

	return (
		<div
			className={`flex flex-col justify-between space-y-3 border rounded-[1rem] w-full md:max-w-[380px] p-5 ${isCurrentPlan ? 'bg-white border-[#e5e7eb]' : 'bg-black text-white border-[#e5e7eb]'}`}
		>
			<p>
				{t('label.pricing-plan')}{' '}
				<span
					className={isPremium ? 'h-[18px] items-center px-3 py-[2px] rounded-full text-[13px] leading-none' : ''}
					style={isPremium ? { color: '#fff', background: 'linear-gradient(135deg, #fc3365 10%, #fc3387 15%, #b25cff 65%, #2c46a8 110%)' } : {}}
				>
					{sub.plan_name}
				</span>
			</p>

			<div>
				<div className="flex items-center gap-1">
					<span className="font-medium text-[2rem]">
						{sub.currency === 'RUB' ? '₽' : '$'}

						{sub.amount}
					</span>

					<span className="text-[#777] text-[15px]">{t('label.pricing-per-month')}</span>
				</div>

				<p className="text-[#777] text-[15px]">{sub.description[langKey]}</p>
			</div>

			<div className="space-y-2">
				<h5 className="text-[15px]">{t('label.pricing-features')}:</h5>

				<div className="space-y-1">
					{sub.features[langKey].map((feat, index) => (
						<div className="flex items-center gap-4" key={index}>
							<div className={`${isCurrentPlan ? 'bg-black' : 'bg-white'} p-[2px] rounded-full`}>
								<Check fill={isCurrentPlan ? '#fff' : '#000'} size={13} />
							</div>

							<p className="text-[#777] text-[15px]">{feat}</p>
						</div>
					))}
				</div>
			</div>

			<GUIButton
				className={`!text-[15px] !h-[2.5rem] !mt-3 ${isCurrentPlan ? '!cursor-not-allowed' : '!bg-white !text-black hover:opacity-80'}`}
				disabled={!canCheckout}
				onClick={canCheckout ? handleCheckout : undefined}
			>
				{isCurrentPlan ? t('label.pricing-current') : t('label.pricing-get-started')}
			</GUIButton>
		</div>
	);
};

export default PricingCard;
