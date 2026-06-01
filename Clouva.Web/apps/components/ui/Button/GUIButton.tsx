import Load from '@/components/Loader/Load';
import { useState } from 'react';

interface GUIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	onClick?: () => Promise<void> | void;
	type?: 'button' | 'submit' | 'reset';
}

const GUIButton: React.FC<GUIButtonProps> = ({ disabled, children, className, onClick, type = 'button', ...props }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const handleClick = async () => {
		if (loading) return;

		if (onClick) {
			try {
				setLoading(true);
				await onClick();
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="flex items-center">
			<button
				{...props}
				type={type}
				id="button"
				className={`${className} ${loading && '!opacity-50 !cursor-default'}`}
				disabled={disabled || loading}
				onClick={
					type === 'submit'
						? async (e) => {
								e.preventDefault();
								if (onClick) {
									try {
										setLoading(true);
										await onClick();
									} finally {
										setLoading(false);
									}
								}
							}
						: handleClick
				}
			>
				{loading ? <Load /> : children}
			</button>
		</div>
	);
};

export default GUIButton;
