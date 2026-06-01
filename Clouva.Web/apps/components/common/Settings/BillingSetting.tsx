import { useTranslation } from 'react-i18next';
import { basicUserLoginState } from '@/rest/userAPI';
import GUISwitch from '@/components/ui/Button/GUISwitch';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import { basicPaymentBilling, basicPaymentHistory } from '@/rest/paymentAPI';

const formatTokens = (value: number, locale: string) => value.toLocaleString(locale.startsWith('ru') ? 'ru-RU' : 'en-US');

const formatPrice = (amount: number, currency: string) => {
	const symbol = currency === 'RUB' ? '₽' : '$';
	return `${symbol}${amount}`;
};

const formatDate = (iso: string, locale: string) =>
	new Date(iso).toLocaleDateString(locale.startsWith('ru') ? 'ru-RU' : 'en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

const BillingSetting = () => {
	const { t, i18n } = useTranslation();
	const { data: respUserLoginState } = useHandleServer(['respUserLoginState'], basicUserLoginState);
	const { data: respPaymentBilling } = useHandleServer(['respPaymentBilling'], basicPaymentBilling);
	const { data: respPaymentHistory, loading: respPaymentHistoryLoading } = useHandleServer(['respPaymentHistory'], () => basicPaymentHistory(50));

	const tokensUsed = respUserLoginState?.tokens_used ?? 0;
	const tokensLimit = respUserLoginState?.tokens_limit ?? 0;
	const usagePercent = tokensLimit > 0 ? Math.min(100, (tokensUsed / tokensLimit) * 100) : 0;

	const isPremium = respUserLoginState?.plan_name.toLowerCase() != 'free';

	return (
		<div className="space-y-3">
			<div>
				<h2 className="text-md md:text-lg font-semibold">{t('label.settings-billing')}</h2>
				<p className="text-sm text-gray-500">{t('label.settings-billing-hint')}</p>
			</div>

			<div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
				<div className="flex flex-col gap-2 md:flex-row">
					<div className="flex items-center gap-2 w-[170px] shrink-0">
						<p className="font-medium">{t('label.settings-plan')}</p>
						{isPremium && (
							<div
								className="h-[18px] items-center px-3 py-[2px] rounded-full text-[13px] leading-none"
								style={isPremium ? { color: '#fff', background: 'linear-gradient(135deg, #fc3365 10%, #fc3387 15%, #b25cff 65%, #2c46a8 110%)' } : {}}
							>
								{respUserLoginState?.plan_name}
							</div>
						)}
					</div>

					<div className="flex-1">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm text-gray-500">{t('label.settings-tokens-used')}</span>

							<span className="text-sm font-medium">
								{t('label.settings-tokens-limit', {
									used: formatTokens(tokensUsed, i18n.language),
									limit: formatTokens(tokensLimit, i18n.language),
								})}
							</span>
						</div>

						<div className="h-2 overflow-hidden rounded-full bg-gray-200">
							<div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${usagePercent}%` }} />
						</div>

						<div className="mt-3 flex items-center justify-between">
							<p className="text-sm text-gray-600">
								{t('message.settings-plan-price-hint', {
									price: formatPrice(respUserLoginState?.amount ?? 0, respUserLoginState?.currency ?? 'RUB'),
									limit: formatTokens(tokensLimit, i18n.language),
								})}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="rounded-2xl border border-[#e5e7eb] bg-white">
				<div className="flex items-center justify-between md:justify-start gap-8 p-5">
					<div className="shrink-0">
						<p className="font-medium">{t('label.settings-payment-method')}</p>
						{respPaymentBilling?.payment_method_title && <p className="text-sm text-gray-500">{respPaymentBilling.payment_method_title}</p>}
					</div>

					<GUISwitch checked={respPaymentBilling?.auto_renew_enabled ?? false} disabled={!respPaymentBilling?.has_payment_method} />
				</div>
			</div>

			<div className="rounded-2xl border border-[#e5e7eb] bg-white">
				<div className="border-b border-[#e5e7eb] p-5">
					<p className="font-medium">{t('label.settings-invoices')}</p>
				</div>

				<div className="p-5">
					<div className="flex border-b border-[#e5e7eb] pb-3 text-xs uppercase text-gray-400">
						<div className="flex-1">{t('label.settings-reference')}</div>
						<div className="w-[160px]">{t('label.settings-amount')}</div>
						<div className="w-[115px] md:w-[220px]">{t('label.settings-date')}</div>
					</div>

					{respPaymentHistoryLoading && !respPaymentHistory ? (
						<p className="py-4 text-sm text-gray-500">{t('message.loading')}</p>
					) : !respPaymentHistory?.length ? (
						<p className="py-4 text-sm text-gray-500">—</p>
					) : (
						respPaymentHistory.map((item) => (
							<div key={item.id} className="flex border-b border-[#e5e7eb] py-3 text-sm last:border-b-0">
								<div className="flex-1">{item.plan_name}</div>
								<div className="w-[160px]">{formatPrice(item.amount, item.currency)}</div>
								<div className="w-[115px] md:w-[220px] text-gray-500">{formatDate(item.paid_at ?? item.created_at, i18n.language)}</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default BillingSetting;
