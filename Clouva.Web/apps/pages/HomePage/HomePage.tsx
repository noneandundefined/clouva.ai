import PageLayout from '../PageLayout';
import { useTranslation } from 'react-i18next';
import { useAudioLevel } from '@/hooks/useAudioLevel';
import { useAckAiModels } from '@/context/useAckAiModels';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { GUITextarea } from '@/components/ui/Input/GUITextarea';
import WaveAnimation from '@/components/common/WaveAnimation/WaveAnimation';

import Microphone from '@/components/@icons/microphone';
import PencilPlusOutline from '@/components/@icons/pencil-plus-outline';
import InformationOutline from '@/components/@icons/information-outline';

const HomePage = () => {
	const ackAiModels = useAckAiModels();
	const { t, i18n } = useTranslation();

	const speechLang = i18n.language.startsWith('en') ? 'en-US' : 'ru-RU';
	const { text, setText, isRecording, toggle, loadingRewrite } = useSpeechToText(speechLang);

	/** Auth Session */
	const lsession = localStorage.getItem(CACHEKEYs.L_SESSION);
	const isAuthenticated = !!lsession;

	const level = useAudioLevel(isRecording);

	return (
		<PageLayout>
			<div className="h-full flex flex-1 flex-col justify-between">
				<div className="flex-1 flex items-center justify-center z-[1]">
					<p className="font-semibold text-[2rem] md:text-[3rem] text-center max-w-[600px]">{t('message.speak-dont-type')}</p>
				</div>

				<div className="px-0 lg:px-[20vw] space-y-5">
					<div>
						<GUITextarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder={t('message.result-text-from-clouva')}
							className="bg-[#F9F9F9] w-full resize-none outline-none text-sm py-[10px] px-[20px] rounded-[0.7rem]"
						/>

						{ackAiModels !== 2 && (
							<div className={`flex items-start gap-2 p-3 rounded-[12px] ${ackAiModels === 1 ? 'bg-[#fde897]' : 'bg-[#fd9797]'}`}>
								<div>
									<InformationOutline fill={ackAiModels === 1 ? '#a08938' : '#a03838'} size={21} />
								</div>
								<p className={`${ackAiModels === 1 ? 'text-[#a08938]' : 'text-[#a03838]'} text-sm`}>
									{ackAiModels === 1 ? t('message.ack-ai-one-model') : t('message.ack-ai-zero-model')}
								</p>
							</div>
						)}
					</div>

					<div className="flex items-center justify-between">
						<p className="font-medium">{t('label.clouva')}</p>

						<div className="bg-[#EEF8FF] hover:bg-[#F2FAFF] border border-[#5C8BA9] p-[6px] cursor-pointer rounded-full active:scale-90">
							<PencilPlusOutline fill="#5C8BA9" size={18} />
						</div>
					</div>

					<div className="h-[12rem] lg:h-[20rem] flex flex-col items-center justify-center space-y-5">
						{loadingRewrite ? <p>{t('message.loading')}</p> : <p>{isRecording ? t('message.tap-again-to-finish') : t('message.tap-to-speak')}</p>}

						<div
							className={`
                                bg-black rounded-full p-3 flex items-center justify-center transition-all duration-500 active:scale-90
                                ${isAuthenticated ? 'cursor-pointer active:scale-90' : 'cursor-not-allowed opacity-40'}
                            `}
							onClick={isAuthenticated ? toggle : undefined}
							style={isRecording ? { width: '10rem', height: '10rem' } : { width: '10rem' }}
						>
							{isRecording ? <WaveAnimation level={level} /> : <Microphone fill="#FFFFFF" size={31} />}
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default HomePage;
