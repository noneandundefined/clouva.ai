import PageLayout from '../PageLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/constants';
import { useTranslation } from 'react-i18next';

const ClouvaPage = () => {
	const { t } = useTranslation();

	return (
		<PageLayout>
			<div className="flex-1 flex flex-col space-y-4 items-center justify-center">
				<p className="font-semibold text-[2rem] md:text-[3rem] text-center max-w-[660px]">{t('message.speak-dont-type')}</p>
				<p className="text-[0.9rem] text-center text-[#666] max-w-[660px]">
					AI-сервис, который превращает вашу речь в готовый грамотный текст. Просто говорите: сервис уберёт слова-паразиты, расставит знаки препинания и аккуратно оформит ваши мысли.
				</p>

				<Link to={ROUTES.HOME} className="bg-black rounded-full text-white px-5 py-2 mt-3">
					{t('label.pricing-get-started')}
				</Link>
			</div>
		</PageLayout>
	);
};

export default ClouvaPage;
