import Close from '../@icons/close';
import Tooltip from '../ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useModalContext } from '@/context/useModalContext';

interface ModalProps {
	title?: string;
	width?: string;
	onClose?: () => void;
	children: React.ReactNode;
}

/* Global component for create modal components */
const Modal: React.FC<ModalProps> = ({ title, width = '600px', onClose, children }) => {
	const { t } = useTranslation();

	const { close } = useModalContext();
	const handleClose = onClose || close;

	const modalRef = useRef<HTMLDivElement>(null);

	const [animationClasses, setAnimationClasses] = useState('opacity-0 scale-95');

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimationClasses('opacity-100 scale-100');
		}, 5);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				handleClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleClose]);

	return (
		<div
			className={`fixed inset-0 z-[1005] flex items-center !justify-center bg-black/40 transition-opacity duration-200 ${animationClasses.split(' ').find((cls) => cls.startsWith('opacity-'))}`}
		>
			<div
				ref={modalRef}
				style={{ width }}
				className={`bg-white rounded-lg shadow-lg p-3 sm:p-4 max-w-[96%] sm:max-w-[90%] relative transition-transform duration-200 ${animationClasses}`}
				role="dialog"
				aria-modal="true"
			>
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="text-sm sm:text-[15px] text-left font-medium text-[#333]">{title}</p>
					</div>

					<Tooltip title={t('label.close')} position="bottom">
						<div className="text-[#666] bg-white hover:bg-[#f1f1f1] hover:bg-[#f9f9f9] rounded-[8px] p-[8px] cursor-pointer text-[1.1rem]" onClick={handleClose}>
							<Close fill="#444" size={17} />
						</div>
					</Tooltip>
				</div>

				{children}
			</div>
		</div>
	);
};

export default Modal;
