import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import GUIButton from '@/components/ui/Button/GUIButton';
import { useModalContext } from '@/context/useModalContext';
import { basicUserSessionsDisconnect } from '@/rest/userAPI';

interface ModalRevokeDeviceProps {
	sessionId: string;
	platform: string;
}

const ModalRevokeDevice: React.FC<ModalRevokeDeviceProps> = ({ sessionId, platform }) => {
	const { t } = useTranslation();
	const { close } = useModalContext();

	const queryClient = useQueryClient();

	const platformLabel = platform === 'web' ? t('label.settings-device-web') : t('label.settings-device-desktop');

	const handleConfirm = async () => {
		await basicUserSessionsDisconnect(sessionId);
		await queryClient.invalidateQueries({ queryKey: ['respUserSessions'] });
		
		close();
	};

	return (
		<div className="space-y-3 px-1 pb-2">
			<p className="text-sm text-gray-600">{t('message.revoke-device-hint', { device: platformLabel })}</p>

			<div className="flex flex-col gap-3 md:flex-row">
				<GUIButton className="!h-[40px] !rounded-[8px] !bg-white !text-sm !text-black hover:opacity-80" onClick={close}>
					{t('message.modal-cancel')}
				</GUIButton>

				<GUIButton className="!h-[40px] !rounded-[8px] !text-sm" onClick={handleConfirm}>
					{t('label.settings-revoke')}
				</GUIButton>
			</div>
		</div>
	);
};

export default ModalRevokeDevice;
