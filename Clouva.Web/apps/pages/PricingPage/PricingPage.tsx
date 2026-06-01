import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { basicSubsGet } from '@/rest/subAPI';
import Close from '@/components/@icons/close';
import { ROUTES } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import PricingCard from '@/components/common/Pricing/PricingCard';

const PricingPage = () => {
	const { t } = useTranslation();
    const queryClient = useQueryClient();

	const [searchParams, setSearchParams] = useSearchParams();
	const { data: respSubsGet } = useHandleServer(['respSubsGet'], basicSubsGet);

	useEffect(() => {
		if (searchParams.get('payment') !== 'success') {
			return;
		}

		toast.success(t('message.payment-success'));
        
		queryClient.invalidateQueries({ queryKey: ['respUserLoginState'] });
		queryClient.invalidateQueries({ queryKey: ['respPaymentBilling'] });
		queryClient.invalidateQueries({ queryKey: ['respPaymentHistory'] });

		setSearchParams({}, { replace: true });
	}, [searchParams, setSearchParams, queryClient, t]);

	return (
		<main className="p-[1rem]">
			<Link to={ROUTES.HOME} className="flex justify-end mb-3 md:fixed top-8 right-8">
				<div className="text-[#000] bg-[transparent] hover:bg-[#e5e7eb] rounded-[8px] p-[9px] cursor-pointer text-[1.1rem]">
					<Close fill="#000" size={19} />
				</div>
			</Link>

			<div className="min-h-screen flex flex-col justify-center items-center">
				<div className="space-y-2">
					<h1 className="font-medium text-center text-balance text-[1.5rem] sm:text-[2rem] lg:text-[3rem]">{t('message.pricing-title')}</h1>
					<p className="text-[0.8rem] sm:text-[0.9rem] lg:text-[1rem] text-center text-[#666] max-w-[660px]">{t('message.pricing-subtitle')}</p>
				</div>

				<div className="flex flex-col md:flex-row items-stretch gap-5 mt-[2rem] w-full md:w-auto">
					{respSubsGet?.map((sub, index) => (
						<PricingCard sub={sub} key={index} />
					))}
				</div>
			</div>
		</main>
	);
};

export default PricingPage;
