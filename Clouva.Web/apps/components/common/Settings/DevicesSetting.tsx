import Modal from '@/components/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { formatRelativeTime } from '@/utils/TimeUtils';
import { basicUserSessionsGetList } from '@/rest/userAPI';
import { useModalContext } from '@/context/useModalContext';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import ModalRevokeDevice from '@/components/Modal/ModalRevokeDevice';

const WebIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px] text-[#7d7d7d]">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 0c2.25 2.25 3 5.25 3 9.75s-.75 7.5-3 9.75m0-19.5c-2.25 2.25-3 5.25-3 9.75s.75 7.5 3 9.75m-8.25-9.75h16.5"
		/>
	</svg>
);

const DesktopIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px] text-[#7d7d7d]">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M3.75 5.25A2.25 2.25 0 0 1 6 3h12a2.25 2.25 0 0 1 2.25 2.25v8.25A2.25 2.25 0 0 1 18 15.75H6A2.25 2.25 0 0 1 3.75 13.5V5.25Zm3 13.5h10.5"
		/>
	</svg>
);

const DevicesSetting = () => {
	const { t, i18n } = useTranslation();

	const { open } = useModalContext();

	const { data: respUserSessions, loading: loadingUserSessions } = useHandleServer(['respUserSessions'], basicUserSessionsGetList);

	const handleOpenRevoke = (sessionId: string, platform: string) => {
		open(
			<Modal title={t('message.revoke-device-title')}>
				<ModalRevokeDevice sessionId={sessionId} platform={platform} />
			</Modal>
		);
	};

	const platformLabel = (platform: string) => {
		if (platform === 'web') return t('label.settings-device-web');

		return t('label.settings-device-desktop');
	};

	return (
		<div className="space-y-2">
			<div>
				<h2 className="text-md md:text-lg font-semibold">{t('label.settings-active-sessions')}</h2>
			</div>

			<div className="bg-white border border-[#e5e7eb] rounded-[0.6rem] space-y-5">
				<div className="overflow-hidden">
					<div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_180px_120px] border-b border-[#efefef] px-5 py-3 text-[14px] text-[#5d5d5d]">
						<div>{t('label.settings-device')}</div>
						<div>{t('label.settings-created')}</div>
						<div></div>
					</div>

					{loadingUserSessions && <div className="px-5 py-4 text-[15px] text-[#555]">{t('message.loading')}</div>}

					{!loadingUserSessions && (!respUserSessions || respUserSessions.length === 0) && <div className="px-5 py-4 text-[15px] text-[#555]">{t('label.no-devices')}</div>}

					{!loadingUserSessions &&
						respUserSessions?.map((session) => (
							<div key={session.session_id} className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_180px_120px] items-center border-b border-[#efefef] px-5 py-4">
								<div className="flex items-center gap-2 md:gap-3">
									{session.platform === 'web' ? <WebIcon /> : <DesktopIcon />}

									<span className="text-[15px] text-[#222]">
										{platformLabel(session.platform)}

										{session.current && <span className="ml-2 text-[13px] text-[#888]">({t('label.device-current')})</span>}
									</span>
								</div>

								<div className="text-[15px] text-[#555]">{formatRelativeTime(session.created_at, i18n.language)}</div>

								<div className="flex justify-end">
									{!session.current && (
										<button
											type="button"
											onClick={() => handleOpenRevoke(session.session_id, session.platform)}
											className="rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-[5px] text-[14px] text-[#111] transition hover:bg-[#fafafa]"
										>
											{t('label.settings-revoke')}
										</button>
									)}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default DevicesSetting;
