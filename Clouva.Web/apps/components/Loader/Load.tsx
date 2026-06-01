import { useTranslation } from 'react-i18next';

const Load = () => {
	const { t } = useTranslation();

	return (
		<div className="relative flex justify-center items-center gap-5">
			<p className="text-uppercase">{t('message.please-wait-ellipsis')}</p>
			<div className="absolute right-5">
				<div className={`w-[1.6rem] h-[1.6rem] border-t-2 border-b-2 border-blue-100 rounded-full animate-spin`} />
			</div>
		</div>
	);
};

export default Load;
