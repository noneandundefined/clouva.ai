import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import SentVariant from '@/components/@icons/send-variant';

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 50;

const InputMessage = () => {
	const { t } = useTranslation();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const [message, setMessage] = useState<string>('');
	const [hover, setHover] = useState<boolean>(false);

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = `${MIN_HEIGHT}px`;
			textarea.style.height = Math.min(textarea.scrollHeight, MAX_HEIGHT) + 'px';
		}
	}, [message]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			console.log('Send message:', message);
			setMessage('');
		}
	};

	return (
		<div className="flex items-end gap-2 pb-5 pt-2 backdrop-blur-sm">
			<textarea
				ref={textareaRef}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={t('label.message-input')}
				className="!p-3 !px-5 !bg-[#fff] !rounded-[15px] !border-none focus:!outline-none focus:!ring-0 focus:!shadow-none resize-none overflow-hidden max-h-[200px] w-full"
			/>

			<div
				className="bg-[#fff] hover:bg-[#0293e7] transition cursor-pointer p-[0.7rem] flex items-center justify-center rounded-full"
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				<SentVariant fill={hover ? '#ffffff' : '#0293e7'} size={28} />
			</div>
		</div>
	);
};

export default InputMessage;
