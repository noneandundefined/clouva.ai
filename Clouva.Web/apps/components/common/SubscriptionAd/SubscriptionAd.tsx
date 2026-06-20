import Close from '@/components/@icons/close';
import { useTranslation } from 'react-i18next';

interface SubscriptionAdProps {
	open: boolean;
	close: () => void;
}

const SubscriptionAd: React.FC<SubscriptionAdProps> = ({ open, close }) => {
	const { t } = useTranslation();

	if (!open) return null;

	return (
		<div className="flex items-center gap-3 px-3 py-[2px] rounded-full" style={{ color: '#fff', background: 'linear-gradient(135deg, #fc3365 10%, #fc3387 15%, #b25cff 65%, #2c46a8 110%)' }}>
			<p className="text-sm">{t('message.premium-waiting')}</p>
			<div className="cursor-pointer" onClick={close}>
				<Close fill="#fff" size={17} />
			</div>
		</div>
	);
};

export default SubscriptionAd;
