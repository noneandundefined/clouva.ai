import { useCallback, useEffect } from 'react';
import { ROUTES } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import { basicUserLoginState } from '@/rest/userAPI';
import { GUInput } from '@/components/ui/Input/GUInput';
import GUIButton from '@/components/ui/Button/GUIButton';
import { clearRedirectUrl } from '@/utils/ReturnUrlUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import { basicDeviceConfirm, basicDeviceSessionGetBySessionId } from '@/rest/deviceAPI';

const AuthorizeDevicePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();

	const session_id = searchParams.get('session_id');

	const { data: respUserLoginState } = useHandleServer(['respUserLoginState'], basicUserLoginState);

	const fetchDeviceSessionGetBySessionId = useCallback(() => basicDeviceSessionGetBySessionId(session_id ?? ''), [session_id]);
	const { data: respDeviceSessionGetBySessionId } = useHandleServer(['respDeviceSessionGetBySessionId', session_id], fetchDeviceSessionGetBySessionId);

	useEffect(() => {
		if (!session_id) {
			navigate(ROUTES.HOME);
		}
	}, [session_id, navigate]);

	useEffect(() => {
		if (respDeviceSessionGetBySessionId && !respDeviceSessionGetBySessionId.valid) {
			navigate(ROUTES.HOME);
		}
	}, [respDeviceSessionGetBySessionId, navigate]);

	const handleConfirm = async () => {
		if (!session_id) return;

		const response = await basicDeviceConfirm(session_id);

		clearRedirectUrl();
		if (response.confirmed) navigate(ROUTES.HOME);
	};

	return (
		<main className="flex justify-center mt-[5vw]">
			<div className="flex flex-col space-y-7 w-[700px] p-5 bg-white">
				<p className="text-center font-semibold text-[20px]">{t('message.authorize-device-title')}</p>

				<div>
					<span className="text-sm">{t('message.authorize-device-logged-as')}</span>
					<GUInput className="!rounded-[6px] !h-[40px]" value={respUserLoginState?.email} disabled />
				</div>

				<p className="text-sm">{t('message.authorize-device-hint')}</p>

				<div className="flex flex-col md:flex-row gap-3 w-full">
					<GUIButton
						className="!rounded-[8px] !h-[35px] !text-sm"
						onClick={() => {
							clearRedirectUrl();
							navigate(ROUTES.HOME);
						}}
					>
						{t('message.authorize-device-cancel')}
					</GUIButton>

					<GUIButton className="!rounded-[8px] !h-[35px] !text-sm" onClick={handleConfirm}>
						{t('message.authorize-device-confirm')}
					</GUIButton>
				</div>
			</div>
		</main>
	);
};

export default AuthorizeDevicePage;
